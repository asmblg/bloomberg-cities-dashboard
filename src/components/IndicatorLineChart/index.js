import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line } from 'recharts';
import PropTypes from 'prop-types';

import IndicatorDropdown from '../IndicatorDropdown';

import { handleDataArrayAndOtherDataKeys, handleIndicators, handleTicks } from './utils';
import dateToQuarter from '../../utils/dateToQuarter';
import abbreviateNumber from '../../utils/abbreviateNumber';
import './style.css';

const IndicatorLineChart = ({ config, data, mainLine, compareLine }) => {
  const [indicators, setIndicators] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [otherLines, setOtherLines] = useState(null);
 
  useEffect(() => {
    if (mainLine && data?.[mainLine]) {
      const indicatorDataObj = handleIndicators(data[mainLine], config);

      if (indicatorDataObj.indicatorsArray) {
        setIndicators(indicatorDataObj.indicatorsArray);
      }

      if (indicatorDataObj.currentIndicator) {
        setSelectedIndicator(indicatorDataObj.currentIndicator);
      }
    }
    
  }, [mainLine, data]);

  useEffect(() => {
    if (mainLine && data?.[mainLine] && selectedIndicator?.key) {
      const { dataArr, keys } = handleDataArrayAndOtherDataKeys({
        data,
        mainLine,
        selectedIndicator,
        config,
        compareLine
      });

      setDataArray(dataArr);
      setOtherLines(keys);
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
          <LineChart data={dataArray} margin={{ top: 100, right: 20, left: 20, bottom: 0 }}>
            <XAxis
              type={'category'}
              dataKey='key'
              tickCount={2}
              tickLine={{ stroke: 'transparent' }}
              axisLine={{stroke: 'black', strokeDasharray: '1 0'}}
              interval={'preserveStartEnd'}
              tickFormatter={(key, i) => {
                if (i === 0 || i === dataArray.length - 1) {
                  return dateToQuarter(key);
                }
                return '';
              }}
            />
            <YAxis
              tickLine={false}
              domain={config.yaxis.domain}
              ticks={handleTicks(dataArray, config.yaxis.tickCount)}
              tickFormatter={(text, i) => i !== 0 ? abbreviateNumber(text) : ''}
              label={{value: config.yaxis.label, angle: '-90', position: 'insideLeft', dy: 50 }}
            />
            {/* <CartesianGrid strokeDasharray={'3 3'} vertical={false} horizontal={true} /> */}

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
};

IndicatorLineChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  mainLine: PropTypes.string,
  compareLine: PropTypes.string
};

export default IndicatorLineChart;
