import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './style.css';

const Header = ({ headerConfig, project, sectionKeys, sections, viewType }) => {
  return viewType === 'desktop' ? (
    <header id='desktop-header-container'>
      <div className='brand-container'>
        <div className='title-container'>
          {/* <img src={header.logoURL} /> */}
          <div className='header-logo'>{'CITY LOGO'}</div>
          <div className='header-title'>{headerConfig.title}</div>
        </div>
        <div className='about-container'>
          <div role='button'>{'About the project'}</div>
          <div role='button'>{'Data documentation'}</div>
        </div>
      </div>
      <div className='nav-container'>
        {sectionKeys.map(key => (
          <Link
            key={`nav-link-${key}`}
            to={key === 'overview' ? `/${project}` : `/${project}/${key}`}
          >
            {sections[key].label ? sections[key].label : 'No label'}
          </Link>
        ))}
      </div>
    </header>
  ) : (
    <header id='mobile-header-container'>
      <h1>Mobile Header</h1>
    </header>
  );
};

Header.propTypes = {
  headerConfig: PropTypes.object,
  project: PropTypes.string,
  sectionKeys: PropTypes.array,
  sections: PropTypes.object,
  viewType: PropTypes.string
};

export default Header;
