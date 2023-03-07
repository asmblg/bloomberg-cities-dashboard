import React from 'react';
import PropTypes from 'prop-types';

const DonutChart = ({ config }) => {
  console.log(config);
  return (
    <div>
      <h1>D0nut</h1>
    </div>
  );
};

DonutChart.propTypes = {
  config: PropTypes.object
};

export default DonutChart;
