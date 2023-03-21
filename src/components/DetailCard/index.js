import React from 'react';
import PropTypes from 'prop-types';

import CommunityProfile from '../CommunityProfile';

import './style.css';

const DetailCard = ({ config, sectionKey }) => {
  const { label } = config;

  return (
    <div className='full-card-wrapper'>
      <div className='full-card-container'>
        {sectionKey !== 'community' ? (
          <div className='detail-card-section'>
            <div className='detail-title bold-font'>{label.toUpperCase()}</div>
          </div>
        ) : (
          <CommunityProfile label={label} />
        )}
      </div>
    </div>
  );
};

DetailCard.propTypes = {
  config: PropTypes.object,
  sectionKey: PropTypes.string
};

export default DetailCard;
