import React, { useEffect, useState } from 'react';
import AnimatedNumber from '../AnimatedNumber';
import './style.css'


const Card = ({ indicator, indicatorData, manifest }) => {
  const [mostRecentValue, setMostRecentValue] = useState();
  const [mostRecentYear, setMostRecentYear] = useState();
  // console.log(indicatorData);

  useEffect(() => {
    const sortedKeys = Object.keys(indicatorData).sort((a, b) => b - a);
    setMostRecentValue(indicatorData[sortedKeys[0]])
    setMostRecentYear(sortedKeys[0])
  }, [indicatorData])
  return (
    <div className='card'>
      <div className='indicator-label'>
        {manifest[indicator]}
      </div>
      <div className='indicator-year'>{mostRecentYear}</div>
      <div className='indicator-most-recent-value'>
        <AnimatedNumber value={mostRecentValue} />
      </div>
    </div>
  )
};

export default Card;
