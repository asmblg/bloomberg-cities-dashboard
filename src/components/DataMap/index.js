import React, { useEffect, useState } from 'react';
import colormap from 'colormap';


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
      MAP GOES HERE
    </div>
  )

}

export default DataMap;