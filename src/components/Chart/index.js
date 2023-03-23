import React from 'react';
import PropTypes from 'prop-types';

import LineChart from './subComponents/LineChart';
import ColumnChart from './subComponents/ColumnChart';
import DonutChart from './subComponents/DonutChart';
import HorizontalBarChart from './subComponents/HorizontalBarChart';

import './style.css';
import getMostRecentDateKeys from '../../utils/getMostRecentDateKeys';
import sortDatesArray from '../../utils/sortDatesArray';

const Chart = ({ config, height, width, margin, data }) => {
  const { type, label, color, accentColor, range, radius } = config;

  // Initialized data handler for chart types
  const handleData = (config, data) => {
    const dateKeys = Object.keys(data);
    const dataArrayLength =
      config.dateType === 'month' ? 12 : config.dataType === 'quarter' ? 4 : null;

    switch (type) {
      case 'column': {
        // console.log(type, data);
        return null;
      }
      case 'donut': {
        // console.log(type, data);
        return null;
      }
      case 'line': {
        const dataKeys = getMostRecentDateKeys(dateKeys, dataArrayLength);
        const sortedArray = sortDatesArray(dataKeys, 'ascending').map(date => ({
          name: date,
          value: data[date]
        }));
        // Calculation: Comparing current value to previous value to determine the difference between the two
        // Need clarification if this is the calculation needed for this specific line chart
        // First use: Jobs added Summary Card
        const dataArray =
          config.valueCalculation === 'difference'
            ? sortedArray.map(({ name, value }, index, array) => {
              if (index === 0) {
                // first iteration, return 0 because no previous value to compare to
                return {
                  name: name,
                  value: 0
                };
              } else {
                const prevValue = array[index - 1].value;
                // return the difference between current and previous value
                return {
                  name: name,
                  value: value - prevValue
                };
              }
            })
            : sortedArray;

        return dataArray;
      }
      case 'horizontal-bar': {
        // console.log(type, data, color);
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
          dataArray={handleData(config, data)}
          config={config}
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
