"use client";
import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function GoogleMaps() {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        // apiKey: process.env.key as string,
        version: "weekly",
        libraries: ["places"],
      });

      const { Map } = await loader.importLibrary("maps");

      const locationMap = {
        lat: 0.287225,
        lng: 32.607778,
      };

      const { Marker } = (await loader.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;

      const options: google.maps.MapOptions = {
        center: locationMap,
        zoom: 15,
        mapId: "PITHYMEANS_MAPS",
      };

      const map = new Map(mapRef.current as HTMLDivElement, options);

      //add marker in the map
      const marker = new Marker({
        map: map,
        position: locationMap,
        title: "Uganda Office",
      });
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(marker.getPosition() as google.maps.LatLng);
      map.fitBounds(bounds);
    };
    initMap();
  }, []);

  return <div className="h-[300px]" ref={mapRef}></div>;
}
