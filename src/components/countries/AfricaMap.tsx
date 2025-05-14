
import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "/africa.json";

interface AfricaMapProps {
  selectedRegion?: string;
  onRegionClick?: (region: string) => void;
}

const regionColors = {
  "Nord": "#e74c3c",
  "Ouest": "#2ecc71",
  "Est": "#3498db",
  "Centrale": "#f1c40f",
  "Australe": "#9b59b6"
};

const countryToRegion = {
  "DZ": "Nord", "EG": "Nord", "LY": "Nord", "MA": "Nord", "TN": "Nord",
  "BJ": "Ouest", "BF": "Ouest", "CV": "Ouest", "CI": "Ouest", "GM": "Ouest",
  "GH": "Ouest", "GN": "Ouest", "GW": "Ouest", "LR": "Ouest", "ML": "Ouest",
  "MR": "Ouest", "NE": "Ouest", "NG": "Ouest", "SN": "Ouest", "SL": "Ouest",
  "TG": "Ouest",
  "BI": "Est", "KM": "Est", "DJ": "Est", "ER": "Est", "ET": "Est",
  "KE": "Est", "MG": "Est", "MW": "Est", "MU": "Est", "MZ": "Est",
  "RW": "Est", "SC": "Est", "SO": "Est", "SS": "Est", "TZ": "Est",
  "UG": "Est",
  "AO": "Centrale", "CM": "Centrale", "CF": "Centrale", "TD": "Centrale",
  "CG": "Centrale", "CD": "Centrale", "GQ": "Centrale", "GA": "Centrale",
  "ST": "Centrale",
  "BW": "Australe", "LS": "Australe", "NA": "Australe", "ZA": "Australe",
  "SZ": "Australe", "ZM": "Australe", "ZW": "Australe"
};

const AfricaMap: React.FC<AfricaMapProps> = ({ selectedRegion, onRegionClick }) => {
  return (
    <div className="relative w-full h-[400px] bg-gray-50 rounded-lg overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 250, center: [20, 5] }}
        width={800}
        height={400}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.properties.code;
              const region = countryToRegion[countryCode];
              const isSelected = selectedRegion === region;
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (onRegionClick && region) {
                      onRegionClick(region);
                    }
                  }}
                  fill={region ? regionColors[region] : "#ccc"}
                  stroke={isSelected ? "#000" : "#FFF"}
                  strokeWidth={isSelected ? 1.5 : 0.5}
                  style={{
                    default: {
                      outline: "none",
                      cursor: "pointer",
                      opacity: isSelected ? 1 : 0.75
                    },
                    hover: {
                      outline: "none",
                      opacity: 1
                    },
                    pressed: {
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default AfricaMap;
