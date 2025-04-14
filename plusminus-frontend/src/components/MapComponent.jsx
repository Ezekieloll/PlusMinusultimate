import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

// Icon paths for markers
const iconPaths = {
  red: '/marker-icon-2x-red.png',
  blue: '/marker-icon-2x-blue.png',
  purple: '/marker-icon-2x-violet.png',
};

const getIcon = (category) => {
  const cat = category?.trim().toLowerCase();
  let iconUrl = iconPaths.red;
  if (cat === 'achievement-based') iconUrl = iconPaths.blue;
  else if (cat === 'neutral') iconUrl = iconPaths.purple;

  return new L.Icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });
};

// 🔥 HeatmapLayer component (with color gradient based on category)
const HeatmapLayer = ({ points, category }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const lowerCategory = category?.trim().toLowerCase();
    let gradient;

    if (lowerCategory === 'crime-related') {
      gradient = { 0.4: '#ff4d4d', 0.65: '#ff1a1a', 1: '#cc0000' }; // Red
    } else if (lowerCategory === 'achievement-based') {
      gradient = { 0.4: '#80bfff', 0.65: '#3399ff', 1: '#0066cc' }; // Blue
    } else {
      gradient = { 0.4: '#d9b3ff', 0.65: '#b266ff', 1: '#6600cc' }; // Purple
    }

    const heatLayer = L.heatLayer(points, {
      radius: 40,
      blur: 10,
      maxZoom: 17,
      gradient: gradient,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, category]);

  return null;
};

function MapComponent({ tweetData }) {
  const [useHeatmap, setUseHeatmap] = useState(false);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const processedData = tweetData.flatMap((tweet) => {
      if (Array.isArray(tweet.coordinates)) {
        return tweet.coordinates.map((coord) => ({
          lat: coord[0],
          lon: coord[1],
          tweet_text: tweet.tweet_text,
          tier1_category: tweet.tier1_category,
          detailed_category: tweet.detailed_category,
          handle: tweet.handle,
          tweet_date: tweet.tweet_date,
        }));
      }
      return [];
    });

    setMarkers(processedData);
  }, [tweetData]);

  const heatmapData = markers.map((m) => [m.lat, m.lon]);

  return (
    <div>
      <label style={{ fontWeight: 'bold' }}>
        <input
          type="checkbox"
          checked={useHeatmap}
          onChange={() => setUseHeatmap(!useHeatmap)}
          style={{ marginRight: '8px' }}
        />
        Show Heatmap
      </label>

      <MapContainer center={[22.5937, 78.9629]} zoom={5} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {useHeatmap && (
          <HeatmapLayer
            points={heatmapData}
            category={markers[0]?.tier1_category}
          />
        )}

        {!useHeatmap &&
          markers.map((marker, idx) => (
            <Marker
              key={idx}
              position={[marker.lat, marker.lon]}
              icon={getIcon(marker.tier1_category)}
            >
              <Popup>
                <strong>{marker.handle}</strong><br />
                {marker.tweet_text}<br />
                <em>{marker.tier1_category} - {marker.detailed_category}</em><br />
                <small>{marker.tweet_date}</small>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
