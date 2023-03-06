import React from 'react';
import PropTypes from 'prop-types';

const DetailCard = ({ config }) => {
  const { label } = config;

  return (
    <div>
      <h1>{label} - Detail Card</h1>
    </div>
  );
};

DetailCard.propTypes = {
  config: PropTypes.object
};

export default DetailCard;
