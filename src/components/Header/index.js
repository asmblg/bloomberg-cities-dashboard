import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import DashboardTitle from '../DashboardTitle';

import { logos } from '../../config/logos';
// import { getCurrentRoute } from './utils';
import homeIcon from '../../assets/icons/home_icon.png';
import './style.css';

const Header = ({
  headerConfig,
  project,
  dashboardType,
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

    if (viewType !== 'desktop' && menuOpen) {
      setMenuOpen(false);
    }
  };

  return viewType ? (
    <>
      <div id='dashboard-header'>
        <div className='title-container'>
          <img className='header-logo' src={logoSrc} />
          {viewType !== 'mobile' ? <DashboardTitle title={headerConfig.title} /> : null}
        </div>
        <div className='about-container'>
          {viewType === 'mobile' ? (
            <DashboardTitle title={headerConfig.title} padding={'5%'} />
          ) : null}
          {viewType === 'tablet' || viewType === 'mobile' ? (
            <Icon
              className='burger-menu-button'
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
                  selectedLink !== 'about' && dashboardType === 'economic'
                    ? 'selected-about-link-container'
                    : 'about-link-container'
                }
              >
                <Link
                  className='about-link'
                  to={`/${project}/${dashboardType}`}
                  onClick={() => linkClickHandler('home')}
                >
                  {'Economic Dashboard'}
                </Link>
              </div>
              <div
                className={
                  selectedLink !== 'about'
                    ? 'about-link-container'
                    : 'selected-about-link-container'
                }
              >
                <Link
                  className='about-link'
                  to={`/${project}/${dashboardType}/about`}
                  onClick={() => linkClickHandler('about')}
                >
                  {'About the project'}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      {viewType !== 'desktop' && menuOpen ? (
        <nav className='nav-dropdown-menu'>
          {sectionKeys.map(key => (
            <Link
              className={`nav-link ${
                key === selectedLink ? 'selected-nav-link' : 'unselected-nav-link'
              }`}
              key={`nav-link-${key}`}
              to={
                key === 'home'
                  ? `/${project}/${dashboardType}`
                  : `/${project}/${dashboardType}/${key}`
              }
              onClick={() => linkClickHandler(key)}
            >
              {key === 'home' ? (
                <img className='navigation-icon' src={homeIcon} />
              ) : (
                sections[key].label
              )}
            </Link>
          ))}
          {viewType !== 'desktop' ? (
            <>
              <Link
                className={`nav-link ${
                  selectedLink === 'about' ? 'selected-nav-link' : 'unselected-nav-link'
                }`}
                key={'nav-link-about'}
                to={`/${project}/${dashboardType}/about`}
                onClick={() => linkClickHandler('about')}
              >
                About the project
              </Link>
              {viewType === 'mobile' ? (
                <Link
                  className={`nav-link ${
                    selectedLink === 'docs' ? 'selected-nav-link' : 'unselected-nav-link'
                  }`}
                  key={'nav-link-docs'}
                  to={`/${project}/${dashboardType}/docs`}
                  onClick={() => linkClickHandler('docs')}
                >
                  Data documentation
                </Link>
              ) : null}
            </>
          ) : null}
        </nav>
      ) : null}
    </>
  ) : (
    <header id='mobile-header-container'>
      <h1>Mobile Header</h1>
    </header>
  );
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
