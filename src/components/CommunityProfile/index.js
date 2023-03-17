import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import Chart from '../Chart';
import LastUpdateIcon from '../LastUpdateIcon';

import infoIcon from '../../assets/icons/info.png';
import './style.css';

const CommunityProfile = ({ label }) => {
  return (
    <>
      <div className='cp-section'>
        <div className='cp-header flex-column'>
          <div className='flex-row'>
            <Icon name='users' size='big' />
            <div className='cp-header-title'>
              <h2 className='bold-font'>{label.toUpperCase()}</h2>
              <h3>{'Q4 2022 Update'}</h3>
            </div>
          </div>
          <LastUpdateIcon date={'01/25/2023 11:55 AM'} width={'100%'} />
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
              data={null}
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
              data={null}
              height={'100%'}
              width={'100%'}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            />
          </div>
        </div>
      </div>
      <div className='cp-section'>
        <div>
          {
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl purus in mollis nunc sed id semper. Sodales ut eu sem integer vitae.'
          }
        </div>
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
              {/* {dataArray.map(({ key, label, value }) => (
                <div className='cp-donut-chart' key={`cp-donut-chart-${key}`}>
                  <div>
                    <Chart
                      config={{ type: 'donut', color: '#006aaf', radius: 20 }}
                      data={{ label, value }}
                      height={50}
                      width={50}
                    />
                    <h1 className='donut-value bold-font'>{value}</h1>
                  </div>

                  <h4>{label}</h4>
                </div>
              ))} */}
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
