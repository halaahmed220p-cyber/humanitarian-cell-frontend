import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// هذا رابط لملف حدود محافظات اليمن (بصيغة TopoJSON)
const YEMEN_GEO_URL = "https://raw.githubusercontent.com/yemen-data/yemen-topojson/master/yemen-governorates.json";

const MapComponent = ({ onSelectLocation }) => {
  return (
    <div className="map-container" style={{ width: "100%", maxWidth: "600px", margin: "auto" }}>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2500, center: [48, 15] }}>
        <Geographies geography={YEMEN_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => onSelectLocation(geo.properties.NAME_1)} // إرسال اسم المحافظة عند الضغط
                style={{
                  default: { fill: "#D6D6DA", stroke: "#FFF", strokeWidth: 0.5 },
                  hover: { fill: "#F53", cursor: "pointer" },
                  pressed: { fill: "#E42" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapComponent;