// Packages
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Components
import Header from '../Header';
import OverviewCard from '../OverviewCard';
import SummaryCard from '../SummaryCard';
import Footer from '../Footer';
// import CategoryRow from '../CategoryRow';

// Styling/Configuration/Utilities
import './style.css';

const Layout = ({ config }) => {
  const defaultSection = 'overview';
  const [section, setSection] = useState(defaultSection);

  return (
    <div id='layout'>
      <Header config={config} setSection={setSection} />

      {section === 'overview' ? (
        <OverviewCard config={config.sections[section]} />
      ) : (
        <SummaryCard config={config.sections[section]} />
      )}

      <Footer config={config.footer} />
    </div>
  );
};

Layout.propTypes = {
  config: PropTypes.object
};

export default Layout;
