import React, { useEffect, useState } from 'react';
// import { Icon } from 'semantic-ui-react';
// import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import CommunityProfile from '../CommunityProfile';
import FlexLayout from '../FlexLayout';
import ShareAndPrintIcons from '../ShareAndPrintIcons';
// import InfoIcon from '../InfoIcon';
import SectionTitle from '../SectionTitle';

import { handleDetailData } from './utils';
import './style.css';

const DetailCard = ({ project, config, sectionKey, viewType, setSelectedLink, selectedLink }) => {
  const [detailData, setDetailData] = useState(null);
  const [infoIconConfig, setInfoIconConfig] = useState({
    title: '',
    aboutDataTitleColor: '',
    tab: ''
  });
  // const navigate = useNavigate();

  // console.log(selectedLink);

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
              height: '50px',
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
        ) : config.layout && detailData ? (
          <FlexLayout
            key={`flex-layout-${sectionKey}`}
            initialState={config?.initialState}
            data={detailData.data}
            layout={config?.layout}
            project={project}
            viewType={viewType}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            infoIconConfig={infoIconConfig}
            setInfoIconConfig={setInfoIconConfig}
          />
        ) : null}
        {/* <div className='section-bottom-container' style={{ margin: '10px' }}> */}
        <div style={{ margin: '10px', position: 'relative' }}>
          {/* <div>text</div> */}
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
