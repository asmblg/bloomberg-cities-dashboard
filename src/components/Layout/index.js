// Packages
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Components
import Header from '../Header';
import SectionsRouter from '../SectionsRouter';
import Footer from '../Footer';

// Styling/Configuration/Utilities
import { handleViewType } from './utils';
import './style.css';

const Layout = ({ config }) => {
  const [viewType, setViewType] = useState('');
  const { project, sections, footer } = config;
  const sectionKeys = Object.keys(sections);
  // const viewType = getViewType(window.innerWidth);

  useEffect(() => {
    const updateViewType = () => setViewType(handleViewType());
    updateViewType();
    window.addEventListener('resize', updateViewType);
    // Cleanup Function
    return () => window.removeEventListener('resize', updateViewType);
  }, []);

  return (
    <div id='layout'>
      <div id='content'>
        <Header
          headerConfig={config.header}
          project={project.toLowerCase()}
          sectionKeys={sectionKeys}
          sections={sections}
          viewType={viewType}
        />
        <SectionsRouter
          project={project.toLowerCase()}
          sectionKeys={sectionKeys}
          sections={sections}
        />
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
