import React from 'react';
import PropTypes from 'prop-types';

import LineChart from './subComponents/LineChart';
import ColumnChart from './subComponents/ColumnChart';
import DonutChart from './subComponents/DonutChart';
import HorizontalBarChart from './subComponents/HorizontalBarChart';

import './style.css';

const Chart = ({ config, height, width, margin, data }) => {
  const { type, label, color, accentColor, range, radius } = config;

  // Filler functionality until data is flowing
  const handleDataArray = (type, data, color) => {
    switch (type) {
      case 'column': {
        const dataArr = data
          ? [...data]
          : [
            {
              // name: xaxis,
              name: 'Q1',
              value: 44
            },
            {
              // name: xaxis,
              name: 'Q2',
              value: 38
            },
            {
              // name: xaxis,
              name: 'Q3',
              value: 65
            },
            {
              // name: xaxis,
              name: 'Q4',
              value: 52
            }
          ];
        return dataArr;
      }
      case 'donut': {
        const obj = { ...data };
        const dataArr = [
          { name: obj.label, value: obj.value, fillColor: color },
          { name: obj.label, value: 100 - obj.value, fillColor: '#dfe5e9' } // if donuts are percentages, second entry will be 100%
        ];

        return dataArr;
      }
      case 'line': {
        const dataArray = data
          ? [...data]
          : [
            {
              name: 'Q1',
              value: 29
            },
            {
              name: 'Q2',
              value: 65
            },
            {
              name: 'Q3',
              value: 45
            },
            {
              name: 'Q4',
              value: 72
            }
          ];

        return dataArray;
      }
      case 'horizontal-bar': {
        const dataArr = [...data].map(({ label, value }) => ({
          name: label,
          value
        }));

        return dataArr;
      }
      default: {
        return [];
      }
    }
  };

  switch (type) {
    case 'line': {
      return (
        <LineChart
          dataArray={handleDataArray(type, data, color)}
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
          dataArray={handleDataArray(type, data, color)}
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
          dataArray={handleDataArray(type, data, color)}
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
          label={label}
          color={color}
          accentColor={accentColor}
          height={height}
          width={width}
          margin={margin}
          range={range}
          dataArray={handleDataArray(type, data)}
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
