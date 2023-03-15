import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import Chart from '../Chart';
import LastUpdate from '../LastUpdate';

import infoIcon from '../../assets/icons/info.png';
import './style.css';

const popTestData = [
  {
    id: 1,
    label: 'Hispanic (all races)',
    value: 26
  },
  { id: 2, label: 'Asian', value: 45 },
  { id: 3, label: 'Black African American', value: 13 },
  { id: 4, label: 'White', value: 67 }
];

const hhTestData = [
  {
    id: 1,
    label: 'Under 5 years old',
    value: '26'
  },
  { id: 2, label: 'Over 65 years old', value: '33' }
];

const hhDonutChartArray = [
  {
    id: 'employment',
    label: 'Population employed',
    value: 17.3
  },
  {
    id: 'living-wage',
    label: 'Population earning a living wage',
    value: 63.7
  },
  {
    id: 'home-ownership',
    label: 'Home ownership',
    value: 55.8
  },
  {
    id: 'house-cost',
    label: 'Housing cost-burdened households',
    value: 46.3
  },
  {
    id: 'bach-degree',
    label: 'Population 25 years and over with a bachelors degree',
    value: 55.8
  }
];

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl purus in mollis nunc sed id semper. Sodales ut eu sem integer vitae.';

const CommunityProfile = ({ label }) => {
  return (
    <>
      <div className='cp-section'>
        <div className='cp-title'>
          <h1 className='bold-font'>{label.toUpperCase()}</h1>
          <h4 className='thin-font'>{'Q4 2022 Update'}</h4>
          <LastUpdate date={'01/25/2023 11:55 AM'} width={'100%'} />
        </div>
        <div className='cp-data-wrapper'>
          <div className='cp-data-title'>
            <div className='cp-indicator-label'>
              <h3>{'TOTAL POPULATION'}</h3>
              <img className='info-icon' src={infoIcon} />
            </div>
            <h1 className='cp-indicator-value bold-font'>{'345,678'}</h1>
          </div>
          <div className='cp-chart-container'>
            <div className='cp-chart-header'>
              <h3>{'RACE AND ETHNICITY'}</h3>
              <img className='info-icon' src={infoIcon} />
            </div>
            <Chart
              config={{ type: 'horizontal-bar', label: 'Race and Ethnicity', color: '#006aaf' }}
              data={popTestData}
              height={'100%'}
              width={'100%'}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            />
          </div>
          <div className='cp-chart-container'>
            <div className='cp-chart-header'>
              <h3>{'AGE GROUPS'}</h3>
              <img className='info-icon' src={infoIcon} />
            </div>
            <Chart
              config={{ type: 'horizontal-bar', label: 'Age Groups', color: 'orange' }}
              data={hhTestData}
              height={'100%'}
              width={'100%'}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            />
          </div>
        </div>
      </div>
      <div className='cp-section'>
        <div>{loremIpsum}</div>
        <div className='cp-data-wrapper'>
          <div className='cp-data-title underline-container'>
            <div className='cp-indicator-label'>
              <h3>{'MEDIAN HOUSEHOLD INCOME'}</h3>
              <img className='info-icon' src={infoIcon} />
            </div>
            <h1 className='cp-indicator-value bold-font'>{'$67,890'}</h1>
          </div>
          <div className='cp-chart-container'>
            <div className='cp-chart-header'>
              <h3>{'HOUSEHOLD ECONOMICS'}</h3>
              {/* <img className='info-icon' src={infoIcon} /> */}
            </div>
            <div className='cp-donuts-container'>
              {hhDonutChartArray.map(({ key, label, value }) => (
                <div className='cp-donut-chart' key={`cp-donut-chart-${key}`}>
                  <div>
                    <Chart
                      config={{ type: 'donut', color: '#006aaf', radius: 20 }}
                      data={{ label, value }}
                      height={50}
                      width={50}
                    />
                    <h1 className='donut-value bold-font'>{value}%</h1>
                  </div>

                  <h4>{label}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='cp-section'>
        <div className='cp-map-dropdown'>
          <Icon
            name={'angle down'}
            size='big'
            // link
          />
          <h3>{'PERCENT ASIAN POPULATION'}</h3>
        </div>
        <div className='cp-map-wrapper'></div>
      </div>
    </>
  );
};

CommunityProfile.propTypes = {
  label: PropTypes.string
};

export default CommunityProfile;
