import React from 'react';
import PropTypes from 'prop-types';

import SimpleColumnChart from '../../SimpleColumnChart';
import SinglePercentDonutChart from '../../SinglePercentDonutChart';

const SummaryChart = ({ config, data }) => {
  const { type } = config;
  switch (type) {
    case 'column': {
      return (
        <SimpleColumnChart
          config={config}
          data={data}
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
          height={100}
          width={'100%'}
        />
      );
    }
    default: {
      return null;
    }
  }
};

SummaryChart.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object
};

export default SummaryChart;
