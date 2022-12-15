import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import './style.css';

import { handleColorData } from './utils';

const DataMap = ({ data, mapConfig }) => {
  const [colorData, setColorData] = useState();

  useEffect(() => setColorData(handleColorData(data)), [data]);

  return (
    <div className='data-map'>
      <MapContainer center={mapConfig.center} zoom={mapConfig.zoom}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON 
        />
      </MapContainer>
    </div>
  )

}

export default DataMap;
