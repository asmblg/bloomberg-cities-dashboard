import React from 'react';
import PropTypes from 'prop-types';

import LineChart from './subComponents/LineChart';
import ColumnChart from './subComponents/ColumnChart';
import DonutChart from './subComponents/DonutChart';
import HorizontalBarChart from './subComponents/HorizontalBarChart';

import './style.css';

const Chart = ({ config, height, width, margin, data }) => {
  const { type, label, color, accentColor, range, radius } = config;

  // Initialized data handler for chart types
  const handleData = (type, data, color) => {
    switch (type) {
      case 'column': {
        console.log('chart', data);
        return null;
      }
      case 'donut': {
        console.log('chart', data);
        return null;
      }
      case 'line': {
        console.log('chart', data);
        return null;
      }
      case 'horizontal-bar': {
        console.log('chart', data, color);
        return null;
      }
      default: {
        return null;
      }
    }
  };

  switch (type) {
    case 'line': {
      return (
        <LineChart
          dataArray={handleData(type, data, color)}
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
          dataArray={handleData(type, data, color)}
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
          dataArray={handleData(type, data, color)}
          label={label}
          color={color}
          height={height}
          width={width}
          radius={radius}
        />
      );
    }
    case 'horizontal-bar': {
      return (
        <HorizontalBarChart
          dataArray={handleData(type, data, color)}
          label={label}
          color={color}
          accentColor={accentColor}
          height={height}
          width={width}
          margin={margin}
          range={range}
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
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default Chart;
