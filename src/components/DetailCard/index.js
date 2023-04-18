import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import CommunityProfile from '../CommunityProfile';
import FlexLayout from '../FlexLayout';
import ShareAndPrintIcons from '../ShareAndPrintIcons';
import LastUpdateIcon from '../LastUpdateIcon';

import { handleDetailData } from './utils';
import './style.css';

const DetailCard = ({ project, config, sectionKey, viewType }) => {
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    handleDetailData(config, project).then(dataObj => {
      if (dataObj) {
        setDetailData(dataObj);
      }
    });
  }, [project, config.dataPath, sectionKey]);

  return (
    <div key={`${sectionKey}-detail-card`} className='full-card-wrapper'>
      <div className='full-card-container detail-card-container'>
        <div
          style={{
            width: '100%',
            height: '50px',
            backgroundColor: config.tabStyle?.selectedColor || '#ffffff'
          }}
        ></div>
        {config.title ? (
          <div className='detail-card-header'>
            <h1
              className='detail-card-title'
              style={{
                color: config.tabStyle?.selectedColor || '#333333'
              }}
            >
              {config.title.toUpperCase()}
            </h1>
            {detailData?.updatedOn && config.displayUpdateDate ? (
              <LastUpdateIcon date={detailData.updatedOn} width={'auto'} />
            ) : null}
          </div>
        ) : null}
        {sectionKey === 'community' ? (
          <CommunityProfile
            project={project}
            config={config}
            detailData={detailData}
            viewType={viewType}
          />
        ) : config.layout && detailData ? (
          <FlexLayout
            key={`flex-layout-${sectionKey}`}
            data={detailData.data}
            layout={config?.layout || null}
            project={project}
          />
        ) : null}
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
  trendDataType: PropTypes.string,
  setTrendDataType: PropTypes.func
};

export default DetailCard;
