import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line } from 'recharts';
import PropTypes from 'prop-types';

import IndicatorDropdown from '../IndicatorDropdown';

import getMostRecentDateKeys from '../../utils/getMostRecentDateKeys';
import sortDatesArray from '../../utils/sortDatesArray';
import dateToQuarter from '../../utils/dateToQuarter';
import './style.css';

const IndicatorLineChart = ({ config, data, mainLine, compareLine }) => {
  const [indicators, setIndicators] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [otherLines, setOtherLines] = useState(null);

  useEffect(() => {
    if (mainLine && data?.[mainLine]) {
      if (!config.preselectedIndicator) {
        const indicatorsArr = Object.keys(data[mainLine]).map(key => ({
          short_name: key,
          key
        }));
      
        if (indicatorsArr?.[0]) {
          setIndicators(indicatorsArr);
          setSelectedIndicator(indicatorsArr[0]);
        }
      } else {
        setSelectedIndicator({
          key: config.preselectedIndicator,
          short_name: config.preselectedIndicator
        });
      }
    }
    
  }, [mainLine, data]);

  useEffect(() => {
    if (mainLine && data?.[mainLine] && selectedIndicator?.key) {
      const mainLineData = data[mainLine][selectedIndicator.key];
      const otherKeys = [];
      const dateKeys = getMostRecentDateKeys(Object.keys(mainLineData), config.dataLength);
      
      const dataArr = sortDatesArray(dateKeys, 'ascending').map(key => {
        const obj = {
          key,
          main: mainLineData[key] 
        };

        if (compareLine && data[compareLine]?.[selectedIndicator.key]) {
          obj.compare = data[compareLine][selectedIndicator.key][key];
        }
        // console.log(config.displayAllCities);
        if (config.displayAllCities) {
          const otherLines = Object.keys(data).filter(key => key !== mainLine && key !== compareLine);

          otherLines.forEach(city => {
            otherKeys.push(city);
            obj[city] = data[city][selectedIndicator.key][key];
          });
        }
        return obj;
      });
      // console.log(dataArr);
      setDataArray(dataArr);
      setOtherLines(otherKeys);
    }
   
  }, [selectedIndicator, compareLine, data, config]);

  return selectedIndicator && dataArray ? (
    <div className='line-chart-container'>
      <IndicatorDropdown
        selectedOption={selectedIndicator}
        setter={setSelectedIndicator}
        options={indicators}
      />

      <div className='line-chart'>
        <ResponsiveContainer height={300} width={'100%'}>
          <LineChart data={dataArray} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <XAxis
              type={'category'}
              dataKey='key'
              tickCount={2}
              tickLine={false}
              interval={'preserveStartEnd'}
              tickFormatter={(key, i) => {
                if (i === 0 || i === dataArray.length - 1) {
                  return dateToQuarter(key);
                }
                return '';
              }}
            />
            <YAxis
              type={'number'}
              tickCount={config.yaxis.tickCount}
              tickLine={false}
              domain={config.yaxis.domain}
              // interval={'preserveEnd'}
              tickFormatter={(text, i) => i !== 0 ? text : ''}
              label={{value: config.yaxis.label, angle: '-90', position: 'insideLeft', dy: 50 }}
            />

            {/* PROJECT DATA LINE */}
            <Line dataKey={'main'} stroke={config.mainColor || 'blue'} strokeWidth={3} />
            {/* SELECTED COMPARE LINE */}
            {compareLine ? (
              <Line dataKey={'compare'} stroke={config.compareColor || 'green'} strokeWidth={3} />
            ) : null}
            {/* ALL OTHER COMPARATIVE LINES */}
            {otherLines ?
              otherLines.map(lineKey => (
                <Line key={`other-line-${lineKey}`} dataKey={lineKey} stroke={config.otherColor || 'gray'} strokeWidth={2} />
              )) : null
            }
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  ) : null;

  // return indicators && selectedIndicator ? (
  //   <div style={{ position: 'relative' }} className='line-chart-container'>
  //     <IndicatorDropdown
  //       selectedOption={selectedIndicator}
  //       setter={setSelectedIndicator}
  //       options={indicators}
  //     />
  //     <div className='line-chart'>
  //       <ResponsiveContainer height={300} width={'100%'}>
  //         <LineChart data={dataArray} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
  //           <XAxis
  //             type={'category'}
  //             dataKey='name'
  //             tickCount={2}
  //             tickLine={false}
  //             interval={'preserveStartEnd'}
  //             tickFormatter={(key, i) => {
  //               if (i === 0 || i === dataArray.length - 1) {
  //                 return dateToQuarter(key);
  //               }
  //               return '';
  //             }}
  //           />
  //           <YAxis
  //             type={'number'}
  //             tickCount={config.yaxis.tickCount}
  //             tickLine={false}
  //             domain={config.yaxis.domain}
  //             interval={'preserveEnd'}
  //           />
  //           {config.lines
  //             ? config.lines.map(({ key, color }) => (
  //               <Line key={`line-${key}-${color}`} dataKey={key} stroke={color} />
  //             ))
  //             : null}
  //         </LineChart>
  //       </ResponsiveContainer>
  //     </div>
  //   </div>
  // ) : null;
};

IndicatorLineChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  mainLine: PropTypes.string,
  compareLine: PropTypes.string
};

export default IndicatorLineChart;
