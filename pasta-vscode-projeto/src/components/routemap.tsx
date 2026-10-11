import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RouteResult } from '../utils/geo';
import { Navigation, Clock } from 'lucide-react';

interface RouteMapProps {
  routeResult: RouteResult | null;
  coletaLabel?: string;
  entregaLabel?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  routeResult,
  coletaLabel,
  entregaLabel
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Inicializa o mapa uma única vez
    if (!mapInstanceRef.current) {
      // Posição padrão: Criciúma - SC (Centro)
      const map = L.map(mapContainerRef.current, {
        center: [-28.6773, -49.3704],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const layers = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      layerGroupRef.current = layers;
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    if (!map || !layerGroup) return;

    // Limpa camadas anteriores
    layerGroup.clearLayers();

    if (routeResult && routeResult.origemCoord && routeResult.destinoCoord) {
      const { origemCoord, destinoCoord, polylineCoords } = routeResult;

      // Ícone Ponto A (Coleta - Verde)
      const iconColeta = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid white;">
            A
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Ícone Ponto B (Entrega - Vermelho)
      const iconEntrega = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #f43f5e; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid white;">
            B
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const markerA = L.marker([origemCoord.lat, origemCoord.lon], { icon: iconColeta })
        .bindPopup(`<b>Ponto A (Coleta):</b><br/>${coletaLabel || 'Origem'}`);
      const markerB = L.marker([destinoCoord.lat, destinoCoord.lon], { icon: iconEntrega })
        .bindPopup(`<b>Ponto B (Entrega):</b><br/>${entregaLabel || 'Destino'}`);

      layerGroup.addLayer(markerA);
      layerGroup.addLayer(markerB);

      // Traça a rota (polylines)
      if (polylineCoords && polylineCoords.length > 0) {
        const polyline = L.polyline(polylineCoords, {
          color: '#059669',
          weight: 5,
          opacity: 0.85,
          lineJoin: 'round',
          dashArray: routeResult.metodo === 'haversine_fallback' ? '6, 10' : undefined
        });
        layerGroup.addLayer(polyline);

        const bounds = L.latLngBounds([
          [origemCoord.lat, origemCoord.lon],
          [destinoCoord.lat, destinoCoord.lon],
          ...polylineCoords
        ]);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      } else {
        const bounds = L.latLngBounds([
          [origemCoord.lat, origemCoord.lon],
          [destinoCoord.lat, destinoCoord.lon]
        ]);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }

    // Força recálculo de tamanho do container
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [routeResult, coletaLabel, entregaLabel]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 h-72 sm:h-80 w-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {routeResult ? (
        <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200/90 text-xs flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold font-mono-numbers">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <span>{routeResult.distanciaKm} km</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>~{routeResult.duracaoMinutos} min de percurso</span>
          </div>
          {routeResult.metodo === 'osrm_driving' && (
            <span className="hidden sm:inline-block text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
              🚗 Carro (Vias OSRM)
            </span>
          )}
        </div>
      ) : (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-xs text-slate-600">
          📍 Digite a Coleta e Entrega para traçar a rota no mapa
        </div>
      )}
    </div>
  );
};
