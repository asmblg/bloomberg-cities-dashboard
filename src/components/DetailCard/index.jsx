import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import CommunityProfile from '../CommunityProfile';
import FlexLayout from '../FlexLayout';
import ShareAndPrintIcons from '../ShareAndPrintIcons';
import SectionTitle from '../SectionTitle';
import { handleDetailData, addWidthToSourcesArray } from './utils';
import './style.css';

const DetailCard = ({ project, config, sectionKey, viewType, setSelectedLink, selectedLink, noTabs }) => {
  const [detailData, setDetailData] = useState(null);
  const [infoIconConfig, setInfoIconConfig] = useState({
    title: '',
    aboutDataTitleColor: '',
    tab: ''
  });

  const sourcesArray = addWidthToSourcesArray(config.sources, config.layout);

  // const isInitialRender = useRef(true);

  useEffect(() => {
    // if (isInitialRender.current) {
    //   isInitialRender.current = false;
    //   return;
    // }
    handleDetailData(config, project).then(dataObj => {
      if (dataObj) {
        // console.log('DATA OBJ', dataObj);
        setDetailData(dataObj);
      }
    });
  }, [project, config.dataPath, sectionKey]);

  return (
    <div key={`${sectionKey}-detail-card`} className='full-card-wrapper'>
      <div
        className='full-card-container detail-card-container'
        style={config.layout?.noTabs 
          ? { height: 'calc(100vh - 250px' } 
          : { ...config.style || {}}
        }
      >
        {sectionKey !== 'about' && viewType !== 'mobile' && !noTabs ? (
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
            manifest={config?.manifest || {}}
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
            {sourcesArray.length > 3 && viewType === 'desktop' ? (
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
                    <span className='tab-src-name'>{name}</span>
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
                      {(i === 0 && sourcesArray[1] || i === 1 && sourcesArray[2]) && viewType !== 'mobile' ? `${name},` : name}
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
