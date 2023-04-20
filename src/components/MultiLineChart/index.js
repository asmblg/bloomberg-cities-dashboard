import React, { useState, useEffect } from 'react';
import { 
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import PropTypes from 'prop-types';

import IndicatorDropdown from '../IndicatorDropdown';

import { handleDataArray, handleLineStyle } from './utils';
import formatValue from '../../utils/formatValue';
import calculateChartDomain from '../../utils/calculateChartDomain';
import getNestedValue from '../../utils/getNestedValue';

const MultiLineChart = ({ config, data, getter, setter }) => {
  const [dataArray, setDataArray] = useState(null);

  const {
    dataPath,
    indicators,
    fixedIndicator,
    dataLength,
    projectColor,
    compareColor,
    otherColor,
    yaxis,
    height,
    width,
    setterKey,
    getterKey
  } = config;

  
  // const setterKey = config.setterKey?.selectedOption;
  const selectedIndicator = getter?.[getterKey?.selectedOption] || null;
  // Looks for a primary line from getter, then for a default primaryLine in the config
  const primaryLine = getterKey?.primaryLine ? getter?.[getterKey?.primaryLine] : config.primaryLine || null;
  const secondaryLine = getterKey?.secondaryLine ? getter?.[getterKey?.secondaryLine] : null;

  const dataObj = data && dataPath ? getNestedValue(data, dataPath) : data ? data : null;
  const allLinesArray = dataObj ? Object.keys(dataObj) : [];

  useEffect(() => {
    if (!selectedIndicator && indicators) {
      if (fixedIndicator) {
        const indicator = indicators.find(({ key }) => key === fixedIndicator);
        setter(setterKey?.selectedOption, indicator);
      } else {
        setter(setterKey?.selectedOption, indicators[0]);
      }
    }
  }, [getter, selectedIndicator]);

  useEffect(() => {
    if (data && selectedIndicator && allLinesArray && (primaryLine || secondaryLine)) {
      handleDataArray({
        mainLineKey: primaryLine?.key || secondaryLine?.key || null,
        data: dataObj || {},
        selectedIndicator,
        allLinesArray: allLinesArray,
        dataLength
      }).then(array => {
        if (array) {
          setDataArray(array);
        }
      });
    }
  }, [selectedIndicator, primaryLine, secondaryLine, data]);

  return selectedIndicator && dataArray ? (
    <div className='chart-container'>
      {!config.disableDropdown ? 
        <IndicatorDropdown
          // selectedOption={selectedIndicator}
          // setterKey={setterKey}
          setter={setter}
          getter={getter}
          config={config}
          options={!fixedIndicator ? indicators : null}
        />
        : null}
      {dataArray[0] ? (
        <ResponsiveContainer
          height={height || '100%'}
          width={width || '100%'}
        >
          <LineChart
            data={dataArray}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} horizontal={true} opacity={0.5} />
            <XAxis
              type={'category'}
              dataKey='name'
              tickLine={false}
              interval={'preserveStartEnd'}
              tickFormatter={(key, i) => {
                if (i === 0 || i === dataArray.length - 1) {
                  return key;
                }
                return '';
              }}
            />
            <YAxis
              domain={calculateChartDomain(dataArray)}
              tickFormatter={text => formatValue(text, selectedIndicator.units)}
              label={{ value: yaxis.label === 'indicator' ? selectedIndicator.label : yaxis.label, angle: '-90', position: 'insideLeft', dy: 50 }}
            />
            <Tooltip />
            {allLinesArray.map(city => {
              const { stroke, strokeWidth, zIndex } = handleLineStyle({
                lineKey: city,
                selectedLineKey: secondaryLine?.key,
                mainLineKey: primaryLine.key,
                projectColor,
                compareColor,
                otherColor
              });
              return (
                <Line
                  type='monotone'
                  key={`multi-line-city-${city}`}
                  dataKey={city}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  zIndex={zIndex}
                  isFront={true}
                  dot={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      ) : null}     
    </div>
  ) : null;
};

MultiLineChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  getter: PropTypes.object,
  setter: PropTypes.func
};

export default MultiLineChart;
