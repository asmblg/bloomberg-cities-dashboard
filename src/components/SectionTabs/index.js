import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import homeIcon from '../../assets/icons/home_icon_white.png';
import './style.css';

const SectionTabs = ({
  sectionKeys,
  sections,
  project,
  dashboardType,
  selectedLink,
  setSelectedLink
}) => {
  return (
    <div className='desktop-tabs'>
      {sectionKeys.map(key => (
        <Link
          key={`${key}-tab-link`}
          className={`${
            selectedLink === key ? 'selected-tab bold-font' : 'unselected-tab primary-font'
          }${key === 'home' ? ' home-tab' : ''}
        `}
          to={`/${project.toLowerCase()}/${dashboardType}${key !== 'home' ? `/${key}` : ''}`}
          onClick={() => setSelectedLink(key)}
        >
          {key === 'home' ? (
            <div className='icon-and-text-tab'>
              <img className='navigation-icon' src={homeIcon} />
              {'KEY INDICATORS'}
            </div>
          ) : (
            sections[key].label.toUpperCase()
          )}
        </Link>
      ))}
    </div>
  );
};

SectionTabs.propTypes = {
  sectionKeys: PropTypes.array,
  sections: PropTypes.object,
  project: PropTypes.string,
  dashboardType: PropTypes.string,
  selectedLink: PropTypes.string,
  setSelectedLink: PropTypes.func
};

export default SectionTabs;
