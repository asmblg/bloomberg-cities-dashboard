import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import OverviewCard from '../OverviewCard';
import SummaryCard from '../SummaryCard';
import ShareAndPrintIcons from '../ShareAndPrintIcons';
import DataToggle from '../TrendDataToggle';

import { handleHomeData } from './utils';
import './style.css';

const Home = ({
  config,
  project,
  dashboardType,
  viewType,
  trendDataType,
  setTrendDataType,
  setSelectedLink
}) => {
  const [data, setData] = useState(null);
  const { summaryCards, overview } = config;

  useEffect(() => {
    handleHomeData(project, summaryCards).then(res => setData(res));
  }, [project, summaryCards]);

  return (
    <div className='home-wrapper'>
      <div className='overview-wrapper'>
        <OverviewCard viewType={viewType} config={overview} />
      </div>
      <div className='summary-wrapper'>
        <>
          <div role='heading' className='summary-header'>
            <h1
              className='large-summary-title'
              style={{
                color: config.tabStyle?.selectedColor || '#333333'
              }}
            >
              {/* Calculate "Q1 2023" via last update? */}
              {config.title} | {'Q1 2023'} UPDATE
            </h1>
            <DataToggle getter={trendDataType} setter={setTrendDataType} />
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
                trendDataType={trendDataType}
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
  trendDataType: PropTypes.string,
  setTrendDataType: PropTypes.func,
  setSelectedLink: PropTypes.func
};

export default Home;
