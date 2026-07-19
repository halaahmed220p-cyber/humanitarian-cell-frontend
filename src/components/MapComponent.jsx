import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import yemenData from './yemenMap.json'; // استيراد البيانات محلياً

const MapComponent = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ComposableMap projection="geoMercator">
        <Geographies geography={yemenData}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapComponent;