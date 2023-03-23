import React from 'react';
import PropTypes from 'prop-types';

import LineChart from './subComponents/LineChart';
import ColumnChart from './subComponents/ColumnChart';
import DonutChart from './subComponents/DonutChart';
import HorizontalBarChart from './subComponents/HorizontalBarChart';

import './style.css';
import { handleData } from './utils';

const Chart = ({ config, height, width, margin, data }) => {
  switch (config.type) {
    case 'line': {
      return (
        <LineChart
          dataArray={handleData(config, data)}
          config={config}
          height={height}
          width={width}
          margin={margin}
        />
      );
    }
    case 'column': {
      return (
        <ColumnChart
          dataArray={handleData(config, data)}
          config={config}
          height={height}
          width={width}
          margin={margin}
        />
      );
    }
    case 'donut': {
      return (
        <DonutChart
          dataArray={handleData(config, data)}
          config={config}
          height={height}
          width={width}
        />
      );
    }
    case 'horizontal-bar': {
      return (
        <HorizontalBarChart
          dataArray={handleData(config, data)}
          config={config}
          height={height}
          width={width}
          margin={margin}
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
