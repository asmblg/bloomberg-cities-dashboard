import React from 'react';
import PropTypes from 'prop-types';

import Chart from '../Chart';
import LastUpdate from '../LastUpdate';

import './style.css';

const DetailCard = ({ config, sectionKey }) => {
  const { label } = config;

  const loremIpsum =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl purus in mollis nunc sed id semper. Sodales ut eu sem integer vitae.';

  return (
    <div className='detail-card-wrapper'>
      {sectionKey !== 'community' ? (
        <div className='detail-card-section'>
          <div className='detail-title bold-font'>{label.toUpperCase()}</div>
        </div>
      ) : (
        <>
          <div className='community-profile-section'>
            <div className='detail-title'>
              <div className='bold-font'>{label.toUpperCase()}</div>
              <div className='thin-font'>{'Q4 2022 Update'}</div>
              <LastUpdate date={'01/25/2023 11:55 AM'} />
            </div>
            <div className='population-data-wrapper'>
              <div className='total-pop-title'>
                <div>{'Total Population'}</div>
                <div>{'999,999'}</div>
              </div>
              <div className='demographics-charts'>
                <Chart
                  config={{type: 'horizontal-bar', label: 'test', color: 'orange' }}
                  data={[{ name: 'ind1', value: '26' }, { name: 'ind2', value: '45' }, { name: 'ind3', value: '13' }, { name: 'ind4', value: '67' }]}
                  height={100}
                  width={'100%'}
                  // margin={{ top: 30, right: 0, bottom: -10, left: -29 }}
                />
              </div>
            </div>
          </div>
          <div className='community-profile-section'>
            <div>{loremIpsum}</div>
          </div>
          <div className='community-profile-section'>
            <div>{'MAP INDICATOR TITLE'}</div>
          </div>
        </>
      )}
    </div>
  );
};

DetailCard.propTypes = {
  config: PropTypes.object,
  sectionKey: PropTypes.string
};

export default DetailCard;
