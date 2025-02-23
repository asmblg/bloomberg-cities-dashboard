import React from 'react';
import PropTypes from 'prop-types';

import SimpleColumnChart from '../../SimpleColumnChart';
import SinglePercentDonutChart from '../../SinglePercentDonutChart';
import SimpleLineChart from '../../SimpleLineChart.js';

import { handleChartCalculator } from '../utils';

const SimpleChart = ({ config, data, viewType  }) => {
  const { type } = config;

  switch (type) {
    case 'column': {
      const chartData = config.calculator
        ? handleChartCalculator(data, config.calculator)
        : data;

      return (
        <SimpleColumnChart
          config={config}
          data={chartData}
          height={150}
          width={'100%'}
          margin={{ top: 10, right: 5, bottom: 0, left: 0 }}
          hasTooltip
        />
      );
    }
    case 'donut': {
      return (
        <SinglePercentDonutChart
          config={config}
          value={data?.value}
          label={data?.key}
          height={100}
          width={'100%'}
          mobile={viewType === 'mobile'}
        />
      );
    }
    case 'line': {
      return (
        <SimpleLineChart
          config={config}
          data={data}
          // height={150}
          // width={'100%'}
          margin={{ top: 10, right: 5, bottom: 0, left: 0 }}
        />
      );
    }
    default: {
      return null;
    }
  }
};

SimpleChart.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  viewType: PropTypes.string
};

export default SimpleChart;
