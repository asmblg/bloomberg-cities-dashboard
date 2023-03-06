import React from 'react';
import PropTypes from 'prop-types';

const SummaryCard = ({ config }) => {
  return (
    <div>
      <h1>{config.label}</h1>
    </div>
  );
};

SummaryCard.propTypes = {
  config: PropTypes.object
};

export default SummaryCard;
