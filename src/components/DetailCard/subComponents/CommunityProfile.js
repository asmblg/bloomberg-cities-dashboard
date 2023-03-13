import React from 'react';
import PropTypes from 'prop-types';

import Chart from '../../Chart';
import LastUpdate from '../../LastUpdate';

const CommunityProfile = ({ label }) => {
  const testData = [
    { name: 'Hispanic (all races)', value: '26' },
    { name: 'Asian', value: '45' },
    { name: 'Black African American', value: '13' },
    { name: 'White', value: '67' }
  ];

  const testData2 = [
    { name: 'Under 5 years old', value: '26' },
    { name: 'Over 65 years old', value: '33' }
    // { name: 'ind3', value: '13' },
    // { name: 'ind4', value: '67' }
  ];

  const loremIpsum =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl purus in mollis nunc sed id semper. Sodales ut eu sem integer vitae.';

  return (
    <>
      <div className='community-profile-section'>
        <div className='detail-title'>
          <div className='bold-font'>{label.toUpperCase()}</div>
          <div className='thin-font'>{'Q4 2022 Update'}</div>
          <LastUpdate date={'01/25/2023 11:55 AM'} />
        </div>
        <div className='population-data-wrapper'>
          <div className='total-pop-title'>
            <div className='pop-title-indicator'>{'TOTAL POPULATION'}</div>
            <div className='pop-title-value bold-font'>{'999,999'}</div>
          </div>
          <div className='cp-charts-container'>
            <div>RACE AND ETHNICITY</div>
            <Chart
              config={{ type: 'horizontal-bar', label: 'test', color: '#006aaf' }}
              data={testData}
              height={'100%'}
              width={'100%'}
              margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
            />
          </div>
          <div className='cp-charts-container'>
            <div>AGE GROUPS</div>
            <Chart
              config={{ type: 'horizontal-bar', label: 'test', color: '#8dc63f' }}
              data={testData2}
              height={'100%'}
              width={'100%'}
              margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
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
  );
};

CommunityProfile.propTypes = {
  label: PropTypes.string
};

export default CommunityProfile;
