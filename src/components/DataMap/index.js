import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import Map  from './Map';
import './style.css';

import { handleColorData } from './utils';

const DataMap = ({ data, mapConfig, tractGeoJSON, indicator }) => {
  const [colorData, setColorData] = useState();

  useEffect(() => setColorData(handleColorData(data)), [data]);

  return (
    <div className='data-map'>
      {colorData 
        ? <MapContainer 
          center={mapConfig.center} 
          zoom={mapConfig.zoom}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { tractGeoJSON && colorData
          ? <GeoJSON
              key={`data-layer-${indicator}`}
              data={tractGeoJSON}
              style={feature => {
                const id = feature.properties.GEOID
                const color = colorData[id]
                  ? colorData[id]
                  : 'transparent';
                // console.log(color)
                return {
                  fillColor: color,
                  color: 'black',
                  weight: 1,
                  opacity: 1,
                  fillOpacity: .9
                };
    
              }}
            />
            : null
          }
          </MapContainer>
        : null
      }
    </div>
  )

}

export default DataMap;
