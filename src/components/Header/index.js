import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import { logos } from '../../config/logos';
import homeIcon from '../../assets/icons/home_icon.png';
import './style.css';

const Header = ({
  project,
  sectionKeys,
  sections,
  viewType,
  selectedLink,
  setSelectedLink
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoSrc = logos[project];

  const linkClickHandler = key => {
    setSelectedLink(key);

    if (viewType === 'mobile' && menuOpen) {
      setMenuOpen(false);
    }
  };

  return viewType ? (
    <>
      <div id='dashboard-header'>
        <div className='title-container'>
          <a href={`/${project}`}>
            <img id='header-logo' src={logoSrc} />
          </a>
        </div>
        <div className='about-container'>
          {viewType === 'mobile' ? (
            <Icon
              id='burger-menu-button'
              // name={menuOpen ? 'angle down' : 'bars'}
              name='bars'
              size={viewType === 'tablet' ? 'big' : 'large'}
              link
              onClick={() => setMenuOpen(!menuOpen)}
            />
          ) : (
            <>
              <div
                className={
                  selectedLink !== 'about'
                    ? 'about-link-container'
                    : 'selected-about-link-container'
                }
              >
                <Link
                  className='about-link'
                  to={`/${project}/about`}
                  onClick={() => linkClickHandler('about')}
                >
                  {'About the data'}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      {viewType === 'mobile' && menuOpen ? (
        <nav className='nav-dropdown-menu'>
          {sectionKeys.map(key => (
            <a
              className={`nav-link ${
                key === selectedLink ? 'selected-nav-link' : 'unselected-nav-link'
              }`}
              key={`nav-link-${key}`}
              href={
                key === 'home'
                  ? `/${project}`
                  : `/${project}/${key}`
              }
              onClick={() => linkClickHandler(key)}
            >
              {key === 'home' ? (
                <>
                  <img className='header-nav-icon' src={homeIcon} />
                  Key Indicators
                </>
              ) : (
                sections[key].label
              )}
            </a>
          ))}
        </nav>
      ) : null}
    </>
  ) : null;
};

Header.propTypes = {
  headerConfig: PropTypes.object,
  project: PropTypes.string,
  dashboardType: PropTypes.string,
  sectionKeys: PropTypes.array,
  sections: PropTypes.object,
  selectedLink: PropTypes.string,
  setSelectedLink: PropTypes.func,
  viewType: PropTypes.string
};

export default Header;
