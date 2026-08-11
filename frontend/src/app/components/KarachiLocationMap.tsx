import { useEffect, useRef, useState } from 'react';
import { MapPin, Globe, Compass, Navigation, Search } from 'lucide-react';

interface MapProps {
  lat?: number;
  lng?: number;
  area?: string;
  street?: string;
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

const KARACHI_ZONES: Record<string, { lat: number; lng: number }> = {
  'gulshan-e-iqbal': { lat: 24.9180, lng: 67.0971 },
  'gulshan': { lat: 24.9180, lng: 67.0971 },
  'defence (dha)': { lat: 24.8152, lng: 67.0674 },
  'dha': { lat: 24.8152, lng: 67.0674 },
  'pechs': { lat: 24.8687, lng: 67.0601 },
  'clifton': { lat: 24.8138, lng: 67.0305 },
  'north karachi': { lat: 24.9810, lng: 67.0650 },
  'orangi town': { lat: 24.9500, lng: 66.9700 },
  'orangi': { lat: 24.9500, lng: 66.9700 },
  'lyari': { lat: 24.8630, lng: 66.9940 },
  'saddar': { lat: 24.8560, lng: 67.0152 },
  'malir': { lat: 24.8960, lng: 67.2050 },
  'korangi': { lat: 24.8280, lng: 67.1400 },
  'nazimabad': { lat: 24.9080, lng: 67.0320 },
  'north nazimabad': { lat: 24.9380, lng: 67.0350 },
  'tariq road': { lat: 24.8720, lng: 67.0590 },
  'rashid minhas': { lat: 24.9150, lng: 67.1080 },
  'rashid minha': { lat: 24.9150, lng: 67.1080 },
  'university road': { lat: 24.9300, lng: 67.1150 },
  'm.a. jinnah': { lat: 24.8610, lng: 67.0120 },
  'sea view': { lat: 24.7980, lng: 67.0310 },
};

export function KarachiLocationMap({
  lat = 24.8607,
  lng = 67.0011,
  area = 'Karachi Central',
  street = 'Main Karachi Road',
  interactive = false,
  onLocationSelect,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [loaded, setLoaded] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({ lat, lng });
  const [isSearching, setIsSearching] = useState(false);

  // Load Leaflet CSS and JS dynamically from unpkg CDN
  useEffect(() => {
    if (window.L) {
      setLoaded(true);
      return;
    }

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(cssLink);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Initialize and manage Leaflet Map instance
  useEffect(() => {
    if (!loaded || !mapContainerRef.current) return;

    const L = window.L;
    if (!L) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      });

      streetLayer.addTo(map);
      mapInstanceRef.current = map;
      mapInstanceRef.current._streetLayer = streetLayer;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
            <div style="background:#2563eb; color:white; font-size:11px; font-weight:bold; padding:3px 8px; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.3); border:1px solid #60a5fa; white-space:nowrap; margin-bottom:2px;">
              📍 ${street || area}
            </div>
            <div style="width:14px; height:14px; background:#2563eb; border:2px solid white; border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([lat, lng], { icon: customIcon, draggable: interactive }).addTo(map);
      markerInstanceRef.current = marker;

      if (interactive) {
        map.on('click', (e: any) => {
          const clickedLat = Number(e.latlng.lat.toFixed(4));
          const clickedLng = Number(e.latlng.lng.toFixed(4));
          setCurrentCoords({ lat: clickedLat, lng: clickedLng });
          marker.setLatLng([clickedLat, clickedLng]);

          if (onLocationSelect) {
            onLocationSelect(clickedLat, clickedLng);
          }
        });

        marker.on('dragend', () => {
          const newPos = marker.getLatLng();
          const draggedLat = Number(newPos.lat.toFixed(4));
          const draggedLng = Number(newPos.lng.toFixed(4));
          setCurrentCoords({ lat: draggedLat, lng: draggedLng });
          if (onLocationSelect) {
            onLocationSelect(draggedLat, draggedLng);
          }
        });
      }
    }
  }, [loaded]);

  // Dynamically fly to location when Area or Street details change!
  useEffect(() => {
    if (!loaded || !mapInstanceRef.current) return;

    const queryStr = `${street || ''} ${area || ''}`.trim().toLowerCase();
    if (!queryStr) return;

    // Check predefined zone coordinates first
    let matchCoords: { lat: number; lng: number } | null = null;
    for (const key of Object.keys(KARACHI_ZONES)) {
      if (queryStr.includes(key)) {
        matchCoords = KARACHI_ZONES[key];
        break;
      }
    }

    if (matchCoords) {
      setCurrentCoords(matchCoords);
      mapInstanceRef.current.flyTo([matchCoords.lat, matchCoords.lng], 15, { duration: 1.2 });
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setLatLng([matchCoords.lat, matchCoords.lng]);
      }
      if (onLocationSelect) {
        onLocationSelect(matchCoords.lat, matchCoords.lng);
      }
    } else {
      // Fetch OpenStreetMap Nominatim search for exact street/landmark in Karachi
      setIsSearching(true);
      const timer = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr + ', Karachi, Pakistan')}&format=json&limit=1`)
          .then(res => res.json())
          .then(data => {
            setIsSearching(false);
            if (data && data[0]) {
              const foundLat = Number(parseFloat(data[0].lat).toFixed(4));
              const foundLng = Number(parseFloat(data[0].lon).toFixed(4));
              setCurrentCoords({ lat: foundLat, lng: foundLng });
              mapInstanceRef.current.flyTo([foundLat, foundLng], 16, { duration: 1.2 });
              if (markerInstanceRef.current) {
                markerInstanceRef.current.setLatLng([foundLat, foundLng]);
              }
              if (onLocationSelect) {
                onLocationSelect(foundLat, foundLng);
              }
            }
          })
          .catch(() => setIsSearching(false));
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [area, street, loaded]);

  const toggleMapType = (type: 'street' | 'satellite') => {
    setMapType(type);
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    if (map._activeLayer) {
      map.removeLayer(map._activeLayer);
    }

    if (type === 'satellite') {
      const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Esri &mdash; World Imagery',
      });
      satLayer.addTo(map);
      map._activeLayer = satLayer;
    } else {
      if (map._streetLayer) {
        map._streetLayer.addTo(map);
        map._activeLayer = map._streetLayer;
      }
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md text-left relative">
      {/* Header Controls */}
      <div className="bg-slate-900/90 backdrop-blur-sm px-4 py-2.5 border-b border-slate-800 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Globe size={14} className="text-emerald-400" />
          <span>Karachi Auto-Locate GIS Map</span>
          {isSearching && (
            <span className="text-[10px] text-amber-400 flex items-center gap-1">
              <Search size={10} className="animate-spin" /> Locating address...
            </span>
          )}
          {!isSearching && (
            <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-mono text-[10px] border border-emerald-800">
              {currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => toggleMapType('street')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              mapType === 'street' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Street Map
          </button>
          <button
            type="button"
            onClick={() => toggleMapType('satellite')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              mapType === 'satellite' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div className="relative h-64 md:h-72 w-full bg-slate-950">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 gap-2 bg-slate-900 z-20">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading Leaflet OpenStreetMap tiles...</span>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Navigation size={13} className="text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-200">{street}</span>
          <span>· {area}, Karachi</span>
        </div>
        {interactive ? (
          <span className="text-[11px] text-blue-400 flex items-center gap-1">
            <Compass size={12} /> Click map to adjust pin position
          </span>
        ) : (
          <span className="text-[11px] text-emerald-400 font-mono font-medium">Verified Location ✓</span>
        )}
      </div>
    </div>
  );
}
