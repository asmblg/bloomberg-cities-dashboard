import React, {useEffect, useState} from 'react';


const Card = ({indicator, indicatorData, manifest}) => {
  const [mostRecentValue, setMostRecentValue] = useState();
  const [mostRecentYear, setMostRecentYear] = useState();
  console.log(indicatorData);

  useEffect(() => {
    const sortedKeys = Object.keys(indicatorData).sort((a,b) => b - a);
    setMostRecentValue(indicatorData[sortedKeys[0]])
    setMostRecentYear(sortedKeys[0])
  })
  return (
    <div>
      {manifest[indicator]}, {mostRecentYear}: {mostRecentValue || 'No Data'}
    </div>
  )
};

export default Card;