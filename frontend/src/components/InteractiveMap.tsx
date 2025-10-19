import { useEffect, useRef, useState } from "react";
import { waterSources, WaterSource } from "@/data/waterSources";
import { Loader2, MapPin, Clock } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ORS_API_KEY = import.meta.env.VITE_OPENROUTE_API_KEY;

const InteractiveMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    arrivalTime: string;
  } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [3.1197, 35.5969],
        zoom: 8,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
      setIsLoading(false);
    }

    // Watch user's live location
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos = { lat: latitude, lng: longitude };
          setUserLocation(newPos);

          const pulseIcon = L.divIcon({
            className: "pulse-marker",
            html: '<div class="pulse-beam"></div>',
            iconSize: [20, 20],
          });

          if (!userMarkerRef.current) {
            userMarkerRef.current = L.marker([latitude, longitude], { icon: pulseIcon })
              .addTo(mapRef.current!)
              .bindPopup("You are here");
            mapRef.current!.setView([latitude, longitude], 11);
          } else {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          }
        },
        (err) => console.error("Location error:", err),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // Draw route when source is selected
  useEffect(() => {
    if (!mapRef.current || !selectedSource || !userLocation) return;

    // Remove previous route
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      setRouteInfo(null);
    }

    const routeUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${userLocation.lng},${userLocation.lat}&end=${selectedSource.lng},${selectedSource.lat}`;

    fetch(routeUrl)
      .then((res) => res.json())
      .then((data) => {
        const coords = data.features[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
        const distanceKm = data.features[0].properties.summary.distance / 1000;
        const durationMin = Math.round(data.features[0].properties.summary.duration / 60);

        const distance = `${distanceKm.toFixed(2)} km`;
        const duration = `${durationMin} min`;

        // Calculate approximate arrival time
        const arrival = new Date(Date.now() + durationMin * 60 * 1000);
        const arrivalTime = arrival.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setRouteInfo({ distance, duration, arrivalTime });

        const routeLine = L.polyline(coords, { color: "#2563eb", weight: 5 }).addTo(mapRef.current!);
        routeLayerRef.current = routeLine;
        mapRef.current!.fitBounds(routeLine.getBounds());
      })
      .catch((err) => console.error("Routing error:", err));
  }, [selectedSource, userLocation]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Sidebar */}
      <div className="col-span-1 bg-white shadow rounded-lg p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-2">Water Sources</h2>
        <ul className="space-y-2">
          {waterSources.map((source) => (
            <li
              key={source.id}
              onClick={() => setSelectedSource(source)}
              className={`cursor-pointer p-3 rounded-md border transition ${
                selectedSource?.id === source.id
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-100 border-gray-200"
              }`}
            >
              <p className="font-semibold">{source.name}</p>
              <p className="text-sm text-gray-600">{source.location}</p>
              <p className="text-xs text-gray-500 capitalize">
                {source.type} • {source.status}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Map */}
      <div className="relative col-span-1 lg:col-span-3 h-[500px] rounded-lg overflow-hidden shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        <div id="map" className="w-full h-full" />

        {routeInfo && selectedSource && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-lg px-4 py-2 flex flex-col items-center text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{selectedSource.name}</span>
            </div>
            <div className="flex gap-2 mt-1">
              <span>{routeInfo.distance}</span>•<span>{routeInfo.duration}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <Clock className="w-4 h-4" />
              <span>Arrive by {routeInfo.arrivalTime}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
