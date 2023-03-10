import React from 'react';
import PropTypes from 'prop-types';

import LineChart from './subComponents/LineChart';
import ColumnChart from './subComponents/ColumnChart';
import DonutChart from './subComponents/DonutChart';

import './style.css';

const Chart = ({ data, config, height, width, margin }) => {
  console.log('chartData:', data);
  const { type, xaxis, label, color, accentColor, range } = config;
  const dataKey = xaxis ? xaxis : label ? label : null;
  // Create dataArray for Chart types - Donut will need fillColor key/value
  const dataArray = dataKey
    ? [
      {
        [dataKey]: 'Q1-22',
        value: 125
      },
      {
        [dataKey]: 'Q2-22',
        value: 275
      },
      {
        [dataKey]: 'Q3-22',
        value: 200
      },
      {
        [dataKey]: 'Q4-22',
        value: 300
      }
    ]
    : [];

  switch (type) {
    case 'line': {
      return (
        <LineChart
          dataArray={dataArray}
          xaxis={xaxis}
          color={color}
          height={height}
          width={width}
          margin={margin}
          range={range}
        />
      );
    }
    case 'column': {
      return (
        <ColumnChart
          dataArray={dataArray}
          xaxis={xaxis}
          color={color}
          accentColor={accentColor}
          height={height}
          width={width}
          margin={margin}
          range={range}
        />
      );
    }
    case 'donut': {
      return (
        <DonutChart
          dataArray={dataArray}
          label={label}
          color={color}
          height={height}
          width={width}
        />
      );
    }
    default: {
      return null;
    }
  }
};

Chart.propTypes = {
  config: PropTypes.object,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  margin: PropTypes.object,
  data: PropTypes.array
};

export default Chart;
