import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import OverviewCard from '../OverviewCard';
import SummaryCard from '../SummaryCard';
// import DataDocumentation from '../DataDocumentation';
import LastUpdateIcon from '../LastUpdateIcon';

import { handleHomeData } from './utils';
import './style.css';

const Home = ({ config, project, viewType }) => {
  const [data, setData] = useState(null);
  // const tab = docs ? 'docs' : 'indicators';
  const { summaryCards } = config;
  const quarterChangeStr = 'Q3 2022 - Q4 2022 CHANGE';

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
              <div className='large-summary-title bold-font'>KEY INDICATORS</div>
            ) : null}
            <h3>{quarterChangeStr}</h3>
            <LastUpdateIcon
              date={data?.updatedOn}
              width={viewType === 'mobile' ? '100%' : 'auto'}
            />
          </div>
          <div className='summary-cards-container'>
            {summaryCards.map((card, i) => (
              <SummaryCard
                key={`home-summary-card-${i}`}
                config={card}
                data={data?.[card.key]}
                route={`/${project}/${card.key}`}
                viewType={viewType}
              />
            ))}
          </div>
        </>
      </div>
    </div>
  );
};

Home.propTypes = {
  config: PropTypes.object,
  // docs: PropTypes.bool,
  project: PropTypes.string,
  viewType: PropTypes.string
};

export default Home;
