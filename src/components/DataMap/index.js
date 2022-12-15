import React, { useEffect, useState } from 'react';

import { handleColorData } from './utils';

const DataMap = ({ data }) => {
  const [colorData, setColorData] = useState();
  const mostRecentYear = Object.keys(data).sort((a, b) => b - a)[0];

  useEffect(() => setColorData(handleColorData(data, mostRecentYear)), [data, mostRecentYear]);

  return <div className='data-map'>MAP GOES HERE</div>;
};

export default DataMap;
