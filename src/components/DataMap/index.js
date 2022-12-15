import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import colormap from 'colormap';
import './style.css';


const DataMap = ({data}) => {
  const [colorData, setColorData] = useState();

  useEffect(() => {
    let colors = colormap({
      colormap: 'bathymetry',
      nshades: 72,
      format: 'hex',
      alpha: 1
    })
    console.log(colors);

  }, [data])

  return (
    <div className='data-map'>
      <MapContainer center={[51.505, -0.09]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  )

}

export default DataMap;