import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import homeIcon from '../../assets/icons/home_icon_white.png';
import './style.css';

const SectionTabs = ({
  sectionKeys,
  sections,
  project,
  selectedLink,
  setSelectedLink,
  viewType
}) => {
  return (
    <div className='desktop-tabs'>
      {sectionKeys.map(key => {
        const section = sections[key];
        return !section.noTab ? (
          <Link
            key={`${key}-tab-link`}
            id={`${key}-tab-link`}
            className={`${selectedLink === key ? 'selected-tab' : 'unselected-tab'}${
              key === 'home' ? ' home-tab' : ''
            }`}
            to={`/${project.toLowerCase()}${key !== 'home' ? `/${key}` : ''}`}
            onClick={() => setSelectedLink(key)}
            style={
              selectedLink === key
                ? { backgroundColor: section.tabStyle?.selectedColor || '#ffffff' }
                : { backgroundColor: section.tabStyle?.unselectedColor || '#dfe5e9' }
            }
            onMouseEnter={() =>
              document
                .querySelector(`#${key}-tab-link`)
                .setAttribute(
                  'style',
                  `background-color:${section.tabStyle?.selectedColor || '#002944'}`
                )
            }
            onMouseLeave={() => {
              if (selectedLink !== key) {
                document
                  .querySelector(`#${key}-tab-link`)
                  .setAttribute(
                    'style',
                    `background-color:${section.tabStyle?.unselectedColor || '#dfe5e9'}`
                  );
              }
            }}
          >
            {key === 'home' && viewType === 'desktop' ? (
              <div className='icon-and-text-tab'>
                <img className='tab-home-icon' src={homeIcon} />
                {section.label?.toUpperCase() || key}
              </div>
            ) : (
              <div>{section.label?.toUpperCase() || key}</div>
            )}
          </Link>
        ) : null;
      })}
    </div>
  );
};

SectionTabs.propTypes = {
  sectionKeys: PropTypes.array,
  sections: PropTypes.object,
  project: PropTypes.string,
  dashboardType: PropTypes.string,
  selectedLink: PropTypes.string,
  setSelectedLink: PropTypes.func,
  viewType: PropTypes.string
};

export default SectionTabs;
