import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid } from 'recharts';
import PropTypes from 'prop-types';

import IndicatorDropdown from '../IndicatorDropdown';

import { handleDataArray, handleLineStyle } from './utils';
import formatValue from '../../utils/formatValue';
import calculateChartDomain from '../../utils/calculateChartDomain';

const MultiLineChart = ({ config, data, getter }) => {
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [dataArray, setDataArray] = useState(null);

  const {
    projectCity,
    getterKey,
    indicators,
    fixedIndicator,
    dataLength,
    projectColor,
    compareColor,
    otherColor,
    yaxis,
    height,
    width
  } = config;

  const selectedCity = getter[getterKey] || null;
  const allCitiesArray = Object.keys(data).concat([projectCity.key]);

  useEffect(() => {
    if (fixedIndicator) {
      const indicator = indicators.find(({ key }) => key === fixedIndicator);
      setSelectedIndicator(indicator);
    } else {
      setSelectedIndicator(indicators[0]);
    }
  }, []);

  useEffect(() => {
    if (data && data[projectCity.key] && selectedIndicator && allCitiesArray) {
      handleDataArray({
        projectCityKey: projectCity.key,
        data,
        selectedIndicator,
        allCitiesArray,
        dataLength
      }).then(array => {
        if (array) {
          setDataArray(array);
        }
      });
    }
  }, [selectedIndicator, selectedCity, data]);

  return selectedIndicator && dataArray ? (
    <div className='chart-container'>
      <IndicatorDropdown
        selectedOption={selectedIndicator}
        setter={setSelectedIndicator}
        options={!fixedIndicator ? indicators : null}
      />
      <LineChart
        height={height || 300}
        width={width || 300}
        data={dataArray}
        margin={{ top: 100, right: 20, left: 20, bottom: 0 }}
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
          label={{ value: yaxis.label, angle: '-90', position: 'insideLeft', dy: 50 }}
        />
        <Tooltip />
        {allCitiesArray.map(city => {
          const { stroke, strokeWidth, zIndex } = handleLineStyle({
            lineKey: city,
            selectedCityKey: selectedCity?.key,
            projectCityKey: projectCity?.key,
            projectColor,
            compareColor,
            otherColor
          });
          return (
            <Line
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
    </div>
  ) : null;
};

MultiLineChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  getter: PropTypes.object
};

export default MultiLineChart;
