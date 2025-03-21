import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type MarkerType = {
  name: string;
  coordinates: [number, number];
  users: number;
};

const markers: MarkerType[] = [
  { name: "New York", coordinates: [-74.006, 40.7128], users: 1200 },
  { name: "Los Angeles", coordinates: [-118.2437, 34.0522], users: 900 },
  { name: "Chicago", coordinates: [-87.6298, 41.8781], users: 700 },
  { name: "Houston", coordinates: [-95.3698, 29.7604], users: 600 },
  { name: "Phoenix", coordinates: [-112.074, 33.4484], users: 500 },
];

const MapChart = () => (
  <ComposableMap projection="geoMercator">
    <Geographies geography={geoUrl}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill="#EAEAEC"
            stroke="#D6D6DA"
          />
        ))
      }
    </Geographies>
    {markers.map(({ name, coordinates, users }) => (
      <Marker key={name} coordinates={coordinates}>
        <circle
          r={Math.sqrt(users) / 20}
          fill="#10B981"
          stroke="#FFF"
          strokeWidth={2}
        />
        <text
          textAnchor="middle"
          y={-Math.sqrt(users) / 20 - 5}
          style={{ fontFamily: "system-ui", fill: "#5A5A5A" }}
        >
          {name}
        </text>
      </Marker>
    ))}
  </ComposableMap>
);

export default MapChart;
