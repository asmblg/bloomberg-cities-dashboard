import React from 'react';
import PropTypes from 'prop-types';

import OverviewCard from '../OverviewCard';
import SummaryCard from '../SummaryCard';

import orangeDotIcon from './images/update_dot_orange.png';
import './style.css';

const Home = ({ config, project, viewType }) => {
  const { summaryCards } = config;
  const quarterChangeStr = 'Q3 2022 - Q4 2022 CHANGE';
  const recentUpdateDate = '01/25/2023 11:55 AM';

  return (
    <div className='home-wrapper'>
      <div className='overview-wrapper'>
        <OverviewCard viewType={viewType} />
      </div>
      <div className='summary-wrapper'>
        <div role='heading' className='summary-header'>
          <div className='large-summary-title bold-font'>KEY INDICATORS</div>
          <div className='large-summary-title half-opacity'>{quarterChangeStr}</div>
          <div className='updated-date-title half-opacity'>
            <img src={orangeDotIcon} />
            Last Updated {recentUpdateDate}
          </div>
        </div>
        <div className='summary-cards-container'>
          {summaryCards.map((card, i) => (
            <SummaryCard
              key={`home-summary-card-${i}`}
              config={card}
              route={`/${project}/${card.key}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  config: PropTypes.object,
  project: PropTypes.string,
  viewType: PropTypes.string
};

export default Home;
