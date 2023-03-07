import React from 'react';
import PropTypes from 'prop-types';

const LineChart = ({ config }) => {
  console.log(config);
  return (
    <div>
      <h1>Line</h1>
    </div>
  );
};

LineChart.propTypes = {
  config: PropTypes.object
};

export default LineChart;
