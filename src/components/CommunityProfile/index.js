import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

// import Chart from '../Chart';
import DonutChart from './subComponents/DonutChart';
import LastUpdateIcon from '../LastUpdateIcon';
import TrendPill from '../TrendPill';

import infoIcon from '../../assets/icons/info.png';
import './style.css';

const testRacePieData = [
  {
    name: 'Asian',
    value: 33,
    color: 'red'
  },
  {
    name: 'Black African American',
    value: 33,
    color: 'purple'
  },
  {
    name: 'Hispanic (All races)',
    value: 33,
    color: 'gray'
  },
  {
    name: 'White',
    value: 33,
    color: 'green'
  },
  {
    name: 'Other',
    value: 33,
    color: 'blue'
  }
];

const testAgePieData = [
  {
    name: 'Under 19',
    value: 33,
    color: 'red'
  },
  {
    name: '20-34',
    value: 33,
    color: 'purple'
  },
  {
    name: '35-44',
    value: 33,
    color: 'gray'
  },
  {
    name: '45-64',
    value: 33,
    color: 'green'
  },
  {
    name: '65 or over',
    value: 33,
    color: 'blue'
  }
];

const CommunityProfile = ({ viewType }) => {
  return (
    <div className='cp-container'>
      <div className='cp-header'>
        <h4>{'2021 CENSUS AMERICAN COMMUNITY SURVEY DATA UPDATE'}</h4>
        <LastUpdateIcon date={'01/25/2023 11:55 AM'} width={'auto'} />
      </div>
      <div className='cp-body'>
        <div className='cp-section'>
          <div className='cp-data-wrapper'>
            <div className='large-indicator-values-container'>
              <div className='large-indicator-value'>
                <div className='title-info-container'>
                  <h5>{'TOTAL POPULATION'}</h5>
                  <img className='info-icon' src={infoIcon} />
                </div>
                <h2 className='bold-font'>{'387,050'}</h2>
              </div>
              <div className='large-indicator-value'>
                <div className='title-info-container'>
                  <h5>{'NUMBER OF HOUSEHOLDS'}</h5>
                  <img className='info-icon' src={infoIcon} />
                </div>
                <h2 className='bold-font'>{'60,050'}</h2>
              </div>
              <div className='large-indicator-value'>
                <div className='title-info-container'>
                  <h5>{'MEDIAN HOUSEHOLD INCOME'}</h5>
                  <img className='info-icon' src={infoIcon} />
                </div>
                <h2 className='bold-font'>{'$59,893.00'}</h2>
              </div>
              <div className='large-indicator-value'>
                <div className='title-info-container'>
                  <h5>{'MEDIAN HOUSING VALUE'}</h5>
                  <img className='info-icon' src={infoIcon} />
                </div>
                <h2 className='bold-font'>{'$250,893.00'}</h2>
              </div>
            </div>
          </div>
          <div className='cp-data-wrapper'>
            <div>
              <div className='horizontal-percentage-indicator'>
                <h2 className='bold-font'>{'63.7%'}</h2>
                <h5>{'Population earning a living wage'}</h5>
                <TrendPill direction={'up'} value={'+ XX.X%'} height={30} width={190} />
              </div>
              <div className='horizontal-percentage-indicator'>
                <h2 className='bold-font'>{'55.8%'}</h2>
                <h5>{'Home ownership'}</h5>
                <TrendPill direction={'up'} value={'+ XX.X%'} height={30} width={190} />
              </div>
              <div className='horizontal-percentage-indicator'>
                <h2 className='bold-font'>{'46.3%'}</h2>
                <h5>{'Rental cost-burdened households'}</h5>
                <TrendPill direction={'down'} value={'- XX.X%'} height={30} width={190} />
              </div>
              <div className='horizontal-percentage-indicator'>
                <h2 className='bold-font'>{'59.0%'}</h2>
                <h5>{'Population 25 years and over with a bachelors degree or higher'}</h5>
                <TrendPill direction={'up'} value={'+ XX.X%'} height={30} width={190} />
              </div>
            </div>
          </div>
        </div>
        {/* ----------- MAP SECTION ----------- */}
        <div className='cp-section'>
          <div className='cp-map-wrapper'>
            <div className='cp-map-dropdown'>
              <Icon name={'angle down'} size='big' />
              <h3>{'PERCENT ASIAN POPULATION'}</h3>
            </div>
            <div className='cp-map-container'></div>
          </div>
        </div>
        {/* ----------------------------------- */}
        {/* ---------- RIGHT SECTION ---------- */}
        <div className='cp-section'>
          <div className='cp-chart-container'>
            <div className='cp-chart-header'>
              <h5>{'RACE AND ETHNICITY'}</h5>
              <img className='info-icon' src={infoIcon} />
            </div>
            <DonutChart dataArray={testRacePieData} viewType={viewType} />
          </div>
          <div className='cp-chart-container'>
            <div className='cp-chart-header'>
              <h5>{'AGE GROUPS'}</h5>
              <img className='info-icon' src={infoIcon} />
            </div>
            <DonutChart dataArray={testAgePieData} viewType={viewType} />
          </div>
        </div>
      </div>
    </div>
  );
};

CommunityProfile.propTypes = {
  label: PropTypes.string,
  viewType: PropTypes.string
};

export default CommunityProfile;
