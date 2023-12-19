import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import TrendDataToggle from '../TrendDataToggle';
import InfoIcon from '../InfoIcon';

import './style.css';

const SectionTitle = ({
  config,
  getter,
  setter,
  setSelectedLink,
  setInfoIconConfig,
  project,
  selectedLink,
  toggler
}) => {
  const navigate = useNavigate();

  return toggler ? (
    <div className='section-title-with-trend-data-toggler'>
      {config?.title ? (
        <div className='section-title-container'>
          <h1 className='section-title-text' style={config.titleStyle || {}}>
            {config?.title?.toUpperCase() || ''}
          </h1>
          <InfoIcon
            onClick={() => {
              // console.log(config);
              setInfoIconConfig({
                title: config.title.toUpperCase(),
                aboutDataTitleColor: config.titleStyle?.color || 'var(--black-color)',
                tab: selectedLink || 'home'
              });
              setSelectedLink('about');
              navigate(`/${project}/about`);
            }}
          />
        </div>
      ) : null}
      <TrendDataToggle config={config} getter={getter} setter={setter} />
    </div>
  ) : (
    <div className='section-title-container'>
      <h1
        className='section-title-text'
        style={{
          color: config.tabStyle?.selectedColor || '#333333'
        }}
      >
        {config.title?.toUpperCase()}
      </h1>
      <InfoIcon
        onClick={() => {
          setInfoIconConfig({
            title: config.title?.toUpperCase(),
            tab: selectedLink,
            aboutDataTitleColor: config.tabStyle.selectedColor || 'var(--black-color)'
          });
          setSelectedLink('about');
          navigate(`/${project}/about`);
        }}
      />
    </div>
  );
};

SectionTitle.propTypes = {
  config: PropTypes.object,
  getter: PropTypes.object,
  setter: PropTypes.func,
  setSelectedLink: PropTypes.func,
  setInfoIconConfig: PropTypes.func,
  project: PropTypes.string,
  selectedLink: PropTypes.string,
  toggler: PropTypes.bool
};

export default SectionTitle;
