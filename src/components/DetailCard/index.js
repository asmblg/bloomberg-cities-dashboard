import React, { useEffect, useState } from 'react';
// import { Icon } from 'semantic-ui-react';
// import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import CommunityProfile from '../CommunityProfile';
import FlexLayout from '../FlexLayout';
import ShareAndPrintIcons from '../ShareAndPrintIcons';
// import InfoIcon from '../InfoIcon';
import SectionTitle from '../SectionTitle';

import { handleDetailData, addWidthToSourcesArray } from './utils';
import './style.css';

const DetailCard = ({ project, config, sectionKey, viewType, setSelectedLink, selectedLink }) => {
  const [detailData, setDetailData] = useState(null);
  const [infoIconConfig, setInfoIconConfig] = useState({
    title: '',
    aboutDataTitleColor: '',
    tab: ''
  });

  const sourcesArray = addWidthToSourcesArray(config.sources, config.layout);

  useEffect(() => {
    handleDetailData(config, project).then(dataObj => {
      if (dataObj) {
        setDetailData(dataObj);
      }
    });
  }, [project, config.dataPath, sectionKey]);

  return (
    <div key={`${sectionKey}-detail-card`} className='full-card-wrapper'>
      <div
        className='full-card-container detail-card-container'
        style={config.layout?.noTabs ? { height: 'calc(100vh - 250px' } : {}}
      >
        {sectionKey !== 'about' && viewType !== 'mobile' ? (
          <div
            style={{
              width: '100%',
              minHeight: '50px',
              backgroundColor: config.tabStyle?.selectedColor || '#ffffff'
            }}
          />
        ) : null}

        {config.title ? (
          <SectionTitle
            config={config}
            setInfoIconConfig={setInfoIconConfig}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            project={project}
          />
        ) : null}

        {sectionKey === 'community' ? (
          <CommunityProfile
            project={project}
            config={config}
            detailData={detailData}
            viewType={viewType}
          />
        ) : config && detailData ? (
          <FlexLayout
            key={`flex-layout-${sectionKey}`}
            // config={config}
            initialState={config.initialState}
            data={detailData.data}
            layout={config.layout}
            project={project}
            viewType={viewType}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            infoIconConfig={infoIconConfig}
            setInfoIconConfig={setInfoIconConfig}
            tabStyle={config.tabStyle}
            views={config.views}
            viewOptions={config.viewOptions}
          />
        ) : null}

        {sourcesArray?.[0] ? (
          <div className='tab-src-container' style={{ flexDirection: 'row' }}>
            {sourcesArray.length > 2 && viewType === 'desktop' ? (
              sourcesArray.map(({ name, link, width }, i) => (
                <a
                  key={`tab-src-link-${i}`}
                  className='tab-src-link'
                  href={link}
                  target='_blank'
                  rel='noreferrer'
                  style={viewType === 'desktop' ? { width: width || 'auto' } : {}}
                >
                  <h5 className='tab-src-text'>
                    Source: <span className='tab-src-name'>{name}</span>
                  </h5>
                </a>
              ))
            ) : (
              <>
                <h5 className='tab-src-text'>{sourcesArray.length > 1 ? 'Sources:' : 'Source:'}</h5>
                {sourcesArray.map(({ name, link }, i) => (
                  <a
                    key={`tab-src-link-${i}`}
                    className='tab-src-link'
                    href={link}
                    target='_blank'
                    rel='noreferrer'
                    style={viewType === 'desktop' ? { width: 'auto' } : {}}
                  >
                    <h5 className='tab-src-text tab-src-name'>
                      {i === 0 && sourcesArray[1] && viewType !== 'mobile' ? `${name},` : name}
                    </h5>
                  </a>
                ))}
              </>
            )}
          </div>
        ) : null}

        <div style={{ margin: '10px', position: 'relative' }}>
          <ShareAndPrintIcons />
        </div>
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
  setTrendDataType: PropTypes.func,
  selectedLink: PropTypes.string,
  setSelectedLink: PropTypes.func
};

export default DetailCard;
