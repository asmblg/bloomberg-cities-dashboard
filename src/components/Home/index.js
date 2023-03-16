import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import OverviewCard from '../OverviewCard';
import SummaryCard from '../SummaryCard';
import DataDocumentation from '../DataDocumentation';
import LastUpdateIcon from '../LastUpdateIcon';

import './style.css';

const summaryTabs = [
  {
    key: 'indicators',
    text: 'KEY INDICATORS',
    urlSuffix: ''
  },
  {
    key: 'docs',
    text: 'ABOUT THE DATA',
    urlSuffix: '/docs'
  }
];


const Home = ({ config, project, viewType, docs }) => {
  const tab = docs ? 'docs' : 'indicators';
  const { summaryCards } = config;
  const quarterChangeStr = 'Q3 2022 - Q4 2022 CHANGE';
  // const [data, setData] = useState();

  // GET DATA USING SELECT FROM 
  // CONCATENATED MAPPING OF SUMMARY CARD DATA PATHS
  // AND THEN SENT

  return (
    <div className='home-wrapper'>
      <div className='overview-wrapper'>
        <OverviewCard viewType={viewType} />
      </div>
      <div className='summary-wrapper'>
        {viewType !== 'mobile' ? (
          <div className='summary-tabs'>
            {summaryTabs.map(({ key, text, urlSuffix }) => (
              <Link
                key={key}
                className={tab === key ? 'selected-tab bold-font' : 'unselected-tab primary-font'}
                to={`/${project}${urlSuffix}`}
              >
                {text}
              </Link>
            ))}
          </div>
        ) : null}

        <div className='summary-content'>
          {tab === 'indicators' ? (
            <>
              <div role='heading' className='summary-header'>
                {viewType === 'mobile' ? (
                  <div className='large-summary-title bold-font'>KEY INDICATORS</div>
                ) : null}
                <div className='large-summary-title'>{quarterChangeStr}</div>
                <LastUpdateIcon
                  date={'01/25/2023 11:55 AM'}
                  width={viewType === 'mobile' ? '100%' : 'auto'}
                />
              </div>
              <div className='summary-cards-container'>
                {summaryCards.map((card, i) => (
                  <SummaryCard
                    key={`home-summary-card-${i}`}
                    config={card}
                    route={`/${project}/${card.key}`}
                    viewType={viewType}
                  />
                ))}
              </div>
            </>
          ) : (
            <DataDocumentation
              config={{
                title: 'About the Data',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices gravida dictum fusce ut placerat orci nulla. Nisl pretium fusce id velit. Urna et pharetra pharetra massa massa. Curabitur vitae nunc sed velit dignissim sodales ut eu sem. Risus viverra adipiscing at in tellus. Orci nulla pellentesque dignissim enim sit amet. Ut ornare lectus sit amet est. Suspendisse faucibus interdum posuere lorem ipsum dolor. Lorem ipsum dolor sit amet consectetur. Neque sodales ut etiam sit amet nisl purus in. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Sagittis aliquam malesuada bibendum arcu vitae elementum. Dolor morbi non arcu risus quis varius quam quisque. Et malesuada fames ac turpis egestas maecenas pharetra.'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  config: PropTypes.object,
  docs: PropTypes.bool,
  project: PropTypes.string,
  viewType: PropTypes.string
};

export default Home;
