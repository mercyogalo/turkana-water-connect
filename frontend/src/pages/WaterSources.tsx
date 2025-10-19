import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { waterSources, WaterSource } from "@/data/waterSources";
import { Download, MapPin, Droplet, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";

const ORS_API_KEY = import.meta.env.VITE_OPENROUTE_API_KEY;

const WaterSources = () => {
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const sourceMarkersRef = useRef<L.Marker[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; arrivalTime: string } | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", { center: [3.1197, 35.5969], zoom: 8 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
      setIsLoading(false);
    }

    waterSources.forEach((s) => {
      const marker = L.marker([s.lat, s.lng])
        .addTo(mapRef.current!)
        .bindPopup(`${s.name} - ${s.location}`);
      marker.on("click", () => setSelectedSource(s));
      sourceMarkersRef.current.push(marker);
    });

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
        () => {},
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !selectedSource || !userLocation) return;
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      setRouteInfo(null);
    }

    const start = `${userLocation.lng},${userLocation.lat}`;
    const end = `${selectedSource.lng},${selectedSource.lat}`;
    const routeUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${start}&end=${end}`;

    fetch(routeUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!data.features || !data.features[0]) return;
        const coords = data.features[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
        const distanceKm = data.features[0].properties.summary.distance / 1000;
        const durationMin = Math.round(data.features[0].properties.summary.duration / 60);
        const distance = `${distanceKm.toFixed(2)} km`;
        const duration = `${durationMin} min`;
        const arrival = new Date(Date.now() + durationMin * 60 * 1000);
        const arrivalTime = arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setRouteInfo({ distance, duration, arrivalTime });
        const routeLine = L.polyline(coords, { color: "#2563eb", weight: 5 }).addTo(mapRef.current!);
        routeLayerRef.current = routeLine;
        mapRef.current!.fitBounds(routeLine.getBounds());
      })
      .catch(() => {});
  }, [selectedSource, userLocation]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "maintenance":
        return "text-yellow-600";
      case "inactive":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(waterSources, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "water-sources.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = ["ID", "Name", "Location", "Latitude", "Longitude", "Type", "Status"];
    const csvRows = [
      headers.join(","),
      ...waterSources.map((s) => [s.id, s.name, s.location, s.lat, s.lng, s.type, s.status].join(",")),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "water-sources.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Water Sources</h1>
            <p className="text-xl text-primary-foreground/90">
              Explore and navigate to water sources across Turkana County
            </p>
          </div>
        </section>

        <section className="py-12 relative">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar list */}
            <div className="lg:col-span-1 bg-card border border-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Available Sources</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={downloadCSV}>
                    <Download className="h-4 w-4" /> CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadJSON}>
                    <Download className="h-4 w-4" /> JSON
                  </Button>
                </div>
              </div>
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
                    <div className="flex items-start gap-2">
                      <Droplet className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-semibold">{source.name}</p>
                        <p className="text-sm text-gray-600">
                          <MapPin className="inline w-3 h-3 mr-1" />
                          {source.location}
                        </p>
                        <p className={`text-xs ${getStatusColor(source.status)}`}>
                          {source.type} • {source.status}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map area */}
            <div className="lg:col-span-3 relative rounded-lg border border-border shadow-lg">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}
              <div id="map" className="w-full h-[600px]" />
            </div>
          </div>

          {/* Floating route info box OUTSIDE map container */}
          <AnimatePresence>
            {routeInfo && selectedSource && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-xl px-6 py-4 border border-gray-200 z-50 flex flex-col items-center text-sm font-medium text-gray-700"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">{selectedSource.name}</span>
                </div>
                <div className="flex gap-2 mb-1">
                  <span>{routeInfo.distance}</span>•<span>{routeInfo.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Arrive by {routeInfo.arrivalTime}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default WaterSources;
