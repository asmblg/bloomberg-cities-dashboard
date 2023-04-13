import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import CommunityProfile from '../CommunityProfile';
import FlexLayout from '../FlexLayout';
import ShareAndPrintIcons from '../ShareAndPrintIcons';
import LastUpdateIcon from '../LastUpdateIcon';

import getNestedValue from '../../utils/getNestedValue';
import { getData } from '../../utils/API';
import './style.css';

const DetailCard = ({ project, config, sectionKey, viewType }) => {
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    const dataPath = `data.${config.dataPath}`;
    getData(project, dataPath).then(({ data }) => {
      const [dataObj] = data;

      setDetailData({
        updatedOn: dataObj.updatedOn,
        data: getNestedValue(dataObj, dataPath)
      });
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
        <div className='detail-card-header'>
          <div className='detail-header-titles'>
            {config.title ? (
              <h1
                style={{
                  color: config.tabStyle?.selectedColor || '#333333'
                }}
              >
                {config.title.toUpperCase()}
              </h1>
            ) : null}
            {!config.title && config.label ? (
              <h2
                style={{
                  color: config.tabStyle?.selectedColor || '#333333'
                }}
              >
                {config.label}
              </h2>
            ) : null}
          </div>
          {detailData?.updatedOn && config.displayUpdateDate ? (
            <LastUpdateIcon date={detailData.updatedOn} width={'auto'} />
          ) : null}
        </div>
        {sectionKey === 'community' ? (
          <CommunityProfile
            project={project}
            config={config}
            detailData={detailData}
            viewType={viewType}
          />
        ) : config.layout && detailData ? (
          <FlexLayout data={detailData.data} layout={config?.layout || null} project={project} />
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
