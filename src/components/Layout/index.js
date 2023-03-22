// Packages
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import Header from '../Header';
import SectionTabs from '../SectionTabs';
import SectionsRouter from '../SectionsRouter';
import Footer from '../Footer';

// Styling/Configuration/Utilities
import { handleViewType, getCurrentRoute } from './utils';
// import homeIcon from '../../assets/icons/home_icon.png';
import './style.css';

const Layout = ({ config }) => {
  const [viewType, setViewType] = useState('');
  const [selectedLink, setSelectedLink] = useState('');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { project, sections, footer, dashboardType } = config;
  const sectionKeys = Object.keys(sections);

  useEffect(() => {
    const updateViewType = () => setViewType(handleViewType());

    updateViewType();
    window.addEventListener('resize', updateViewType);
    // Cleanup Function
    return () => window.removeEventListener('resize', updateViewType);
  }, []);

  useEffect(() => {
    if (project && sectionKeys) {
      const { section, redirect } = getCurrentRoute(project, sectionKeys, pathname);
      setSelectedLink(section);

      if (redirect) {
        navigate(`${config.project.toLowerCase()}/${config.dashboardType}`);
      }
    }
  }, []);

  return (
    <div id='layout'>
      <div id='content'>
        <nav id='header-container'>
          <Header
            headerConfig={config.header}
            project={project.toLowerCase()}
            dashboardType={dashboardType}
            sectionKeys={sectionKeys}
            sections={sections}
            viewType={viewType}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
          />
        </nav>
        <div id='section-container'>
          {viewType === 'desktop' ? (
            <SectionTabs
              sectionKeys={sectionKeys}
              sections={sections}
              project={project}
              dashboardType={dashboardType}
              selectedLink={selectedLink}
              setSelectedLink={setSelectedLink}
            />
          ) : null}

          <SectionsRouter
            project={project.toLowerCase()}
            dashboardType={dashboardType}
            sectionKeys={sectionKeys}
            sections={sections}
            viewType={viewType}
          />
        </div>
      </div>
      <footer id='footer'>
        <Footer config={footer} />
      </footer>
    </div>
  );
};

Layout.propTypes = {
  config: PropTypes.object
};

export default Layout;
