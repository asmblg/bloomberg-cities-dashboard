import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip, CartesianGrid } from 'recharts';
import PropTypes from 'prop-types';

import IndicatorDropdown from '../IndicatorDropdown';

import { handleDataArray } from './utils';
import calculateChartDomain from '../../utils/calculateChartDomain';

const CompareColumnChart = ({ config, data, projectCity, selectedCity }) => {
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const { fixedIndicator, dataLength, mainColor, compareColor, indicators } = config;
  const allCitiesArray = [projectCity, selectedCity];

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

  useEffect(() => {
    if (fixedIndicator) {
      const indicator = indicators.find(({ key }) => key === fixedIndicator);
      setSelectedIndicator(indicator);
    } else {
      setSelectedIndicator(indicators[0]);
    }
  }, []);

  return selectedIndicator && dataArray ? (
    <>
      <IndicatorDropdown
        selectedOption={selectedIndicator}
        setter={setSelectedIndicator}
        options={!fixedIndicator ? indicators : null}
      />

      <ResponsiveContainer height={300} width={'100%'}>
        <BarChart data={dataArray} margin={{ top: 100, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid vertical={false} horizontal={true} opacity={0.5} />
          <XAxis
            type={'category'}
            dataKey='name'
            tickCount={2}
            barSize={10}
            tickLine={{ stroke: 'transparent' }}
            axisLine={{ stroke: 'black', strokeDasharray: '1 0' }}
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
            type={'number'}
            label={{ value: config.yaxis.label, angle: '-90', position: 'insideLeft', dy: 50 }}
          />
          <Tooltip />

          {!fixedIndicator && allCitiesArray
            ? allCitiesArray.map(({ key }, i) => (
              <Bar
                key={`${key}-line-${i}`}
                dataKey={key}
                fill={key === projectCity.key ? mainColor : compareColor}
                isFront={true}
              />
            ))
            : null}
        </BarChart>
      </ResponsiveContainer>
    </>
  ) : null;
};

CompareColumnChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  projectCity: PropTypes.object,
  selectedCity: PropTypes.object,
  allCitiesArray: PropTypes.array,
  indicators: PropTypes.array
};

export default CompareColumnChart;
