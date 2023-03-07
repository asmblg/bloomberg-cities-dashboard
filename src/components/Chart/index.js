import React from 'react';
import PropTypes from 'prop-types';

import LineChart from './subComponents/LineChart';
import ColumnChart from './subComponents/ColumnChart';
import DonutChart from './subComponents/DonutChart';

import './style.css';

const Chart = ({ config }) => {
  switch (config.type) {
    case 'line': {
      return <LineChart config={config} />;
    }
    case 'column': {
      return <ColumnChart config={config} />;
    }
    case 'donut': {
      return <DonutChart config={config} />;
    }
    default: {
      return null;
    }
  }
};

Chart.propTypes = {
  config: PropTypes.object
};

export default Chart;
