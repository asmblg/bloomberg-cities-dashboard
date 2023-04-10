import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import CompareColumnChart from '../CompareColumnChart';
import MultiLineChart from '../MultiLineChart';
import TrendDataToggle from '../TrendDataToggle';
// import getDataCompareDates from '../../utils/getDataCompareDates';
// import IndicatorDropdown from '../IndicatorDropdown';

import './style.css';

const Jobs = ({ config, data, project, trendDataType, setTrendDataType }) => {
  const [selectedCity, setSelectedCity] = useState({
    key: 'default',
    text: 'Select metro area to compare job data'
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { projectCity, compareCities, charts } = config;

  return data && data[project] ? (
    <div className='jobs-container'>
      {/* ---------- Trend indicators ---------- */}
      <div className='jobs-trend-container'>
        <TrendDataToggle trendDataType={trendDataType} setTrendDataType={setTrendDataType} />
        <div className='indicator-trend-container'>indicator box</div>
        <div className='indicator-trend-container'>indicator box</div>
      </div>
      {/* ---------- Job select container ---------- */}
      <div className='jobs-compare-container'>
        <div className='jcs-header'>
          <h5 className='bold-font'>{compareCities?.title || ''}</h5>
          <div className='jobs-legend'>
            <div className='project-city'>
              <h5>{projectCity.text || ''}</h5>
              <svg id='main-city-rect' height={'15px'} width={'15px'}>
                <rect height={'15px'} width={'15px'} />
              </svg>
            </div>
            <div className='city-select-dropdown'>
              <div className='city-selection' onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div>
                  <Icon name='angle down' size='big' />
                  <h5>{selectedCity.text}</h5>
                </div>
                {selectedCity.key && selectedCity.key !== 'default' ? (
                  <svg id='compare-city-rect' height={'15px'} width={'15px'}>
                    <rect height={'15px'} width={'15px'} />
                  </svg>
                ) : null}
              </div>
              {dropdownOpen ? (
                <ul className='city-select-options'>
                  {compareCities?.cities && compareCities.cities[0]
                    ? compareCities.cities.map(city => (
                      <li
                        className={
                          selectedCity.key === city.key
                            ? 'selected-city-option'
                            : 'unselected-city-option'
                        }
                        key={city.key}
                        onClick={() => {
                          setSelectedCity(city);
                          setDropdownOpen(false);
                        }}
                      >
                        {city.text}
                      </li>
                    ))
                    : null}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
        {/* ---------- Charts ---------- */}
        <div className='jobs-charts-wrapper'>
          {charts && charts[0]
            ? charts.map((chart, i) => 
              chart.type === 'two-bars' ? (
                <div key={`jobs-multiline-chart-${i}`} className='jobs-chart-container'>
                  <CompareColumnChart
                    config={chart}
                    data={data}
                    projectCity={projectCity}
                    selectedCity={selectedCity}
                    allCitiesArray={[projectCity, selectedCity]}
                  />
                </div>
              ) : chart.type === 'multi-line' ? (
                <div key={`jobs-multiline-chart-${i}`} className='jobs-chart-container'>
                  <MultiLineChart
                    data={data}
                    config={chart}
                    selectedCity={selectedCity}
                    projectCity={projectCity}
                  />  
                </div>
              ): null
            )
            : null}
        </div>
      </div>
    </div>
  ) : <div>Loading...</div>;
};

Jobs.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  project: PropTypes.string,
  viewType: PropTypes.string,
  trendDataType: PropTypes.string,
  setTrendDataType: PropTypes.func
};

export default Jobs;
