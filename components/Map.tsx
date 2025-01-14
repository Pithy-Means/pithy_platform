'use client';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, {Map as leafletMap} from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRef, useEffect } from 'react';

// Fix the marker icon issue by defining a custom icon
const customIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"), // Use require for string URL
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // size of the shadow
});

const Map = () => {
  // Ref  to store the map instance
  const mapRef = useRef<leafletMap | null>(null);

  //Handler for when the map is created
  // const handleMapCreated = (mapInstance: L.Map) => {
  //   if (!mapRef.current) {
  //     mapRef.current = mapInstance;
  //   } else {
  //     return;
  //   }
  // };

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <MapContainer
      style={{
        height: "300px",
        width: "100%",
      }}
      center={[0.287225, 32.607778]}
      zoom={19} // zoom level
      scrollWheelZoom={true}
      // whenCreated={handleMapCreated}  //use to get the map instance
      whenReady={() => {
        if (mapRef.current) return;  // store the map instance
        mapRef.current = mapRef.current;  // Assign mapRef
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[0.28461, 32.60856]} icon={customIcon}>
        <Popup>Pithy Means Uganda Office</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
