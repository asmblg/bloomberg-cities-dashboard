import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import { logos } from '../../config/logos';
import { getCurrentRoute } from './utils';
import homeIcon from './images/home_icon.png';
import './style.css';

const Header = ({ headerConfig, project, sectionKeys, sections, viewType }) => {
  const [selectedLink, setSelectedLink] = useState(getCurrentRoute(project, sectionKeys) || 'home');
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
      <div className='brand-container'>
        <div className='title-container'>
          <img className='header-logo' src={logoSrc} />
          {viewType !== 'mobile' ? (
            <div className='edd-title bold-font'>{headerConfig.title}</div>
          ) : null}
        </div>
        <div className='about-container'>
          {viewType === 'mobile' ? (
            <div className='edd-title bold-font'>{headerConfig.title}</div>
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
              <Link to={`/${project}/about`}>{'About the project'}</Link>
            </>
          )}
        </div>
      </div>
      {viewType === 'desktop' || menuOpen ? (
        <nav className='nav-container'>
          {sectionKeys.map(key => (
            <Link
              className={`nav-link ${
                key === selectedLink ? 'selected-nav-link' : 'unselected-nav-link'
              }`}
              key={`nav-link-${key}`}
              to={key === 'home' ? `/${project}` : `/${project}/${key}`}
              onClick={() => linkClickHandler(key)}
            >
              {key === 'home' ? (
                <img className='nav-link-icon' src={homeIcon} />
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
                to={`/${project}/about`}
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
                  to={`/${project}/docs`}
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
  sectionKeys: PropTypes.array,
  sections: PropTypes.object,
  viewType: PropTypes.string
};

export default Header;
