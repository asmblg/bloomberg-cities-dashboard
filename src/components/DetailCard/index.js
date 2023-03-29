import React from 'react';
import PropTypes from 'prop-types';

import CommunityProfile from '../CommunityProfile';
import ShareAndPrintIcons from '../ShareAndPrintIcons';

import './style.css';

const DetailCard = ({ project, config, sectionKey, viewType, dataManifest }) => {
  const { label } = config;

  return (
    <div className='full-card-wrapper'>
      <div className='full-card-container detail-card-container'>
        {sectionKey !== 'community' ? (
          <div className='detail-card-section'>
            <div className='detail-title bold-font'>{label.toUpperCase()}</div>
          </div>
        ) : (
          <div className='cp-wrapper'>
            <CommunityProfile project={project} config={config} viewType={viewType} dataManifest={dataManifest} />
          </div>
        )}
        <ShareAndPrintIcons />
      </div>
    </div>
  );
};

DetailCard.propTypes = {
  project: PropTypes.string,
  config: PropTypes.object,
  sectionKey: PropTypes.string,
  viewType: PropTypes.string,
  dataManifest: PropTypes.object
};

export default DetailCard;
