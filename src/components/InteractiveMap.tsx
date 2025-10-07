import { useEffect, useRef, useState } from 'react';
import { WaterSource } from '@/data/waterSources';
import { Loader2 } from 'lucide-react';

interface InteractiveMapProps {
  waterSources: WaterSource[];
  selectedSource: WaterSource | null;
  onMarkerClick: (source: WaterSource) => void;
}

const InteractiveMap = ({ waterSources, selectedSource, onMarkerClick }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      const google = (window as any).google;
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: 2.5, lng: 35.5 },
        zoom: 8,
        mapTypeControl: false,
      });

      googleMapRef.current = map;
      setIsLoading(false);

      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(userPos);

            // Add user location marker
            userMarkerRef.current = new google.maps.Marker({
              position: userPos,
              map: map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
              },
              title: 'Your Location',
            });
          },
          () => {
            console.log('User denied geolocation');
          }
        );
      }
    };

    // Load Google Maps API
    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  // Add markers for water sources
  useEffect(() => {
    if (!googleMapRef.current) return;

    const google = (window as any).google;
    if (!google) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    waterSources.forEach((source) => {
      const marker = new google.maps.Marker({
        position: { lat: source.lat, lng: source.lng },
        map: googleMapRef.current!,
        title: source.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: source.status === 'active' ? '#10b981' : '#f59e0b',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        onMarkerClick(source);
      });

      markersRef.current.push(marker);
    });
  }, [waterSources, onMarkerClick]);

  // Handle selected source
  useEffect(() => {
    if (!googleMapRef.current || !selectedSource) return;

    const google = (window as any).google;
    if (!google) return;

    const map = googleMapRef.current;
    const selectedPosition = { lat: selectedSource.lat, lng: selectedSource.lng };

    // Zoom to selected source
    map.setZoom(12);
    map.panTo(selectedPosition);

    // Highlight selected marker
    markersRef.current.forEach((marker, index) => {
      const source = waterSources[index];
      const isSelected = source.id === selectedSource.id;
      
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 15 : 10,
        fillColor: isSelected ? '#3b82f6' : (source.status === 'active' ? '#10b981' : '#f59e0b'),
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: isSelected ? 3 : 2,
      });
    });
  }, [selectedSource, waterSources]);

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default InteractiveMap;
