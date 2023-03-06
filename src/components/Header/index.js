import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { logos } from '../../config/logos';
import homeIcon from './images/home_icon.png';
import './style.css';

const Header = ({ headerConfig, project, sectionKeys, sections, viewType }) => {
  const logoSrc = logos[project];

  return viewType === 'desktop' ? (
    <header id='desktop-header-container'>
      <div className='brand-container'>
        <div className='title-container'>
          <img className='header-logo' src={logoSrc} />
          <div className='edd-title'>{headerConfig.title.toUpperCase()}</div>
        </div>
        <div className='about-container'>
          <div role='button'>{'About the project'}</div>
          <div role='button'>{'Data documentation'}</div>
        </div>
      </div>
      <div className='nav-container'>
        {sectionKeys.map(key => (
          <Link
            className='nav-link'
            key={`nav-link-${key}`}
            to={key === 'home' ? `/${project}` : `/${project}/${key}`}
          >
            {key === 'home' ? (
              <img className='nav-link-icon' src={homeIcon} />
            ) : (
              sections[key].label
            )}
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
