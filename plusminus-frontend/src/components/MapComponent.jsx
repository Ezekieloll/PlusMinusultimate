// src/components/MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import marker images using ES module syntax
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issues in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapComponent({ tweetData }) {
  // Debug: Log tweetData to see what we have
  console.log("tweetData:", tweetData);

  // Ensure tweetData is an array
  const tweets = Array.isArray(tweetData) ? tweetData : [];

  // Flatten all coordinates from tweetData.
  // Each tweet is assumed to have a "coordinates" property,
  // which is an array of coordinate pairs (e.g., [[lat, lon], ...]).
  const markers = tweets.flatMap((tweet) => {
    // Check if tweet.coordinates is an array; if not, return an empty array.
    if (!Array.isArray(tweet.coordinates)) return [];
    return tweet.coordinates.map((coord) => ({
      lat: coord[0],
      lon: coord[1],
      tweet_text: tweet.tweet_text,
      tier1_category: tweet.tier1_category,
      detailed_category: tweet.detailed_category,
      handle: tweet.handle,
      tweet_date: tweet.tweet_date,
    }));
  });

  return (
    <MapContainer center={[22.5937, 78.9629]} zoom={5} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, idx) => (
        <Marker key={idx} position={[marker.lat, marker.lon]}>
          <Popup>
            <strong>{marker.handle}</strong><br />
            {marker.tweet_text}<br />
            <em>{marker.tier1_category} - {marker.detailed_category}</em><br />
            <small>{marker.tweet_date}</small>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;
