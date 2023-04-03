import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import OverviewCard from '../OverviewCard';
import SummaryCard from '../SummaryCard';
import ShareAndPrintIcons from '../ShareAndPrintIcons';
import DataToggle from '../TrendDataToggle';

import { handleHomeData } from './utils';
import './style.css';

const Home = ({ config, project, dashboardType, viewType, setTrendDataType, setSelectedLink }) => {
  const [data, setData] = useState(null);
  const { summaryCards } = config;

  useEffect(() => {
    handleHomeData(project, summaryCards).then(res => setData(res));
  }, [project, summaryCards]);

  return (
    <div className='home-wrapper'>
      <div className='overview-wrapper'>
        <OverviewCard viewType={viewType} />
      </div>
      <div className='summary-wrapper'>
        <>
          <div role='heading' className='summary-header'>
            {viewType === 'mobile' ? (
              <div className='large-summary-title bold-font'>{config.title}</div>
            ) : null}
            <h1 className='large-summary-title bold-font'>
              {/* Calculate "Q1 2023" via last update? */}
              {config.title} | {'Q1 2023'} UPDATE
            </h1>
            <DataToggle setTrendDataType={setTrendDataType} />
          </div>
          <div className='summary-cards-container'>
            {summaryCards.map((card, i) => (
              <SummaryCard
                key={`home-summary-card-${i}`}
                config={card}
                data={data?.[card.key]}
                project={project}
                dashboardType={dashboardType}
                cardKey={card.key}
                viewType={viewType}
                setSelectedLink={setSelectedLink}
              />
            ))}
          </div>
        </>
        <div className='home-icons-container'>
          <ShareAndPrintIcons />
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  config: PropTypes.object,
  project: PropTypes.string,
  dashboardType: PropTypes.string,
  viewType: PropTypes.string,
  setTrendDataType: PropTypes.func,
  setSelectedLink: PropTypes.func
};

export default Home;
