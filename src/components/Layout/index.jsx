// Packages
import React, { useState, useEffect, use } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import Header from '../Header';
import SectionTabs from '../SectionTabs';
import SectionsRouter from '../SectionsRouter';
import Footer from '../Footer';

// Styling/Configuration/Utilities
import { handleViewType, getCurrentRoute } from './utils';
import './style.css';

const Layout = ({ config, setShowModal }) => {

  const [viewType, setViewType] = useState('');
  const [selectedLink, setSelectedLink] = useState('');
  const [trendDataType, setTrendDataType] = useState('QtQ'); // Can be toggled between YtY and QtQ
  const { pathname, search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const dev = queryParams.get('dev') === 'true' || false;

  const navigate = useNavigate();
  const sectionKeys = config ? Object.keys(config?.sections || {}) : null;
  const disableHeader = config?.disableHeader;
  const noTabs = dev ? false : config?.noTabs;
  // const disableFooter = config.disableFooter;

  useEffect(() => {
    const updateViewType = () => setViewType(handleViewType());

    updateViewType();
    window.addEventListener('resize', updateViewType);
    // Cleanup Function
    return () => window.removeEventListener('resize', updateViewType);
  }, []);

  useEffect(() => {
    if (config?.project && sectionKeys) {
      const { section, redirect } = getCurrentRoute(config.project, sectionKeys, pathname);
      
      setSelectedLink(section);

      if (redirect) {
        navigate(`${config.project.toLowerCase()}`);
      }
    }
  }, []);

  console.log(config);

  return (
    <div id='layout' style={
      config?.transparentBackground 
      ? { 
          background: 'transparent',
          backgroundImage: 'none', 
        } 
      : { }}>
      <div id='content'>
        {config && pathname !== '/' && !disableHeader?
          <nav id='header-container'>
            <Header
              headerConfig={config.header}
              project={config.project.toLowerCase()}
              dashboardType={config.dashboardType}
              sectionKeys={sectionKeys}
              sections={config.sections}
              viewType={viewType}
              selectedLink={selectedLink}
              setSelectedLink={setSelectedLink}
            />
          </nav>
          : null}

        <div
          id='scrollable-body'
          style={{
            height: pathname !== '/' && !disableHeader ? `calc(100vh - var(--${viewType}-header-height))` : '100%'
          }}
        >
          <div id='section-container'>
            {viewType !== 'mobile' && selectedLink !== 'about' && config && pathname !== '/' && !noTabs ? (
              <SectionTabs
                sectionKeys={sectionKeys}
                sections={config.sections}
                project={config.project}
                dashboardType={config.dashboardType}
                selectedLink={selectedLink}
                setSelectedLink={setSelectedLink}
                viewType={viewType}
              />
            ) : null}

            <SectionsRouter
              noTabs={noTabs}
              disableHeader={disableHeader}
              project={config?.project.toLowerCase()}
              dashboardType={config?.dashboardType}
              sectionKeys={sectionKeys}
              sections={config?.sections}
              viewType={viewType}
              trendDataType={trendDataType}
              setTrendDataType={setTrendDataType}
              selectedLink={selectedLink}
              setSelectedLink={setSelectedLink}
            />
          </div>
          <footer id='footer' style={{...config?.footer?.style}} >
            <Footer 
              setShowModal={setShowModal} 
              noLogo={config?.footer?.noLogo} 
              invertLogos={config?.footer?.invertLogos}
              dataPartners={config?.footer?.dataPartners}
              // style={config?.footer?.style} 
              disableGoogleTranslate={config?.footer?.disableGoogleTranslate}
              />
          </footer>
        </div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  config: PropTypes.object,
  setShowModal: PropTypes.func
};

export default Layout;
