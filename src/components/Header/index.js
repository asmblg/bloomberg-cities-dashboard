import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const Header = ({ config, isMobile }) => {
  const { header, sections } = config;
  console.log(sections);
  const navKeys = Object.keys(sections);

  console.log(header);
  return !isMobile ? (
    <header id='desktop-header-container'>
      <div className='brand-container'>
        <div className='title-container'>
          {/* <img src={header.logoURL} /> */}
          <div className='header-logo'>{'CITY LOGO'}</div>
          <div className='header-title'>{header.title}</div>
        </div>
        <div className='about-container'>
          <div role='button'>{'About the project'}</div>
          <div role='button'>{'Data documentation'}</div>
        </div>
      </div>
      <div className='nav-container'>
        {navKeys.map(key => (
          <h5 key={`nav-link-${key}`}>{sections[key].label ? sections[key].label : 'No label'}</h5>
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
  config: PropTypes.object,
  isMobile: PropTypes.bool,
  setSection: PropTypes.func
};

export default Header;
