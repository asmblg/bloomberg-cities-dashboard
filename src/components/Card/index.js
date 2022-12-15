import React, { useEffect, useState } from 'react';
import AnimatedNumber from '../AnimatedNumber';
// import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import './style.css'


const Card = ({ indicator, indicatorData, manifest }) => {
  const [mostRecentValue, setMostRecentValue] = useState();
  const [mostRecentYear, setMostRecentYear] = useState();
  // const [lineChartData, setLineChartData] = useState();
  // console.log(indicatorData);

  useEffect(() => {
    const sortedKeys = Object.keys(indicatorData).sort((a, b) => b - a);
    // const indicatorDataArray= [...sortedKeys].sort((a,b) => a - b).map(key =>
    //   ({
    //     name: key,
    //     value: indicatorData[key]
    //   })
    // )

    setMostRecentValue(indicatorData[sortedKeys[0]]);
    setMostRecentYear(sortedKeys[0]);
    // setLineChartData(indicatorDataArray);
    
  }, [indicatorData])
  return (
    <div className='card'>
      <div className='indicator-label'>
        {manifest[indicator].label}
      </div>
      <div className='indicator-year'>{mostRecentYear}</div>
      <div className='indicator-most-recent-value'>
        <AnimatedNumber value={mostRecentValue} type={manifest[indicator].type} />
      </div>
      {/* <div className='indicator-sparkline'>
        <ResponsiveContainer width='100%' height={50}>
          <LineChart data={lineChartData || []} width={200} height={50}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            <YAxis domain={['dataMin','dataMax']}/>
          </LineChart>        
        </ResponsiveContainer>


      </div> */}
    </div>
  )
};

export default Card;
