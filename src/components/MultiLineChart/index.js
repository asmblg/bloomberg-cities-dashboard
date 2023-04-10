import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  CartesianGrid
} from 'recharts';
import PropTypes from 'prop-types';

import IndicatorDropdown from '../IndicatorDropdown';

import { handleDataArray } from './utils';
import formatValue from '../../utils/formatValue';
import calculateChartDomain from '../../utils/calculateChartDomain';
// import './style.css';

const MultiLineChart = ({ config, data, selectedCity, projectCity }) => {
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [dataArray, setDataArray] = useState(null);

  const { indicators, fixedIndicator, dataLength, projectColor, compareColor, otherColor } = config;
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
  }, [selectedIndicator, selectedCity]);

  const handleLineStyle = ({
    lineKey,
    selectedCityKey,
    projectCityKey,
    projectColor,
    compareColor,
    otherColor
  }) => {
    // set to non selected / non project city as default
    const obj = {
      stroke: otherColor || 'gray',
      strokeWidth: 1,
      zIndex: 1
    };

    if (lineKey === projectCityKey) {
      obj.stroke = projectColor || 'blue';
      obj.strokeWidth = 3;
      obj.zIndex = 3;
    }
    if (lineKey === selectedCityKey) {
      obj.stroke = compareColor || 'green';
      obj.strokeWidth = 3;
      obj.zIndex = 2;
    }

    return obj;
  };

  return selectedIndicator && dataArray ? (
    <>
      <IndicatorDropdown
        selectedOption={selectedIndicator}
        setter={setSelectedIndicator}
        options={!fixedIndicator ? indicators : null}
      />
      <ResponsiveContainer height={300} width={'100%'}>
        <LineChart data={dataArray} margin={{ top: 100, right: 20, left: 20, bottom: 0 }}>
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
            label={{ value: config.yaxis.label, angle: '-90', position: 'insideLeft', dy: 50 }}
          />
          <Tooltip />
          {allCitiesArray.map(city => {
            const { stroke, strokeWidth, zIndex } = handleLineStyle({
              lineKey: city,
              selectedCityKey: selectedCity.key,
              projectCityKey: projectCity.key,
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
      </ResponsiveContainer>
    </>
  ) : null;
};

MultiLineChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  projectCity: PropTypes.object,
  selectedCity: PropTypes.object
};

export default MultiLineChart;
