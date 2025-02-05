import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import OverviewCard from '../OverviewCard';
import SummaryCard from '../SummaryCard';
import ShareAndPrintIcons from '../ShareAndPrintIcons';
import DataToggle from '../TrendDataToggle';

import { 
  handleHomeData, 
  // formatUpdatedOnDate 
} from './utils';
// import dateToQuarter from '../../utils/dateToQuarter';
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
        <OverviewCard viewType={viewType} config={overview} project={project} />
      </div>
      <div className='summary-wrapper'>
        <>
          <div role='heading' className='summary-header'>
            <div className='summary-title-container'>
              <h1
                className='large-summary-title'
                style={{
                  color: config.tabStyle?.selectedColor || '#333333'
                }}
              >
                {'KEY INDICATORS'}
              </h1>
              {/* {data?.updatedOn ? (
                <>
                  <h1
                    className='large-summary-title'
                    style={{
                      color: config.tabStyle?.selectedColor || '#333333'
                    }}
                  >
                    {'|'}
                  </h1>
                  <h5 style={{ opacity: 0.8 }}>{`LATEST UPDATE: ${formatUpdatedOnDate(
                    data.updatedOn
                  )}`}
                  </h5>
                </>
              ) : null} */}
            </div>

            <DataToggle getter={trendDataType} setter={setTrendDataType} />
          </div>
          <div className='summary-cards-container'>
            {summaryCards.map((card, i) => (
              <SummaryCard
                key={`home-summary-card-${i}`}
                config={card}
                data={data?.[card.key] || data}
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
        <div>
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
