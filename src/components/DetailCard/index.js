import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const DetailCard = ({ config }) => {
  const { label } = config;

  return (
    <div className='detail-card'>
      <div className='bold-font'>{label}</div>
    </div>
  );
};

DetailCard.propTypes = {
  config: PropTypes.object
};

export default DetailCard;
