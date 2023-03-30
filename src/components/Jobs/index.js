import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// import IndicatorDropdown from '../IndicatorDropdown';

import './style.css';

const Jobs = ({ config, data }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [citiesData, setCitiesData] = useState(null);

  const indicators =
    selectedCity && data && data[selectedCity]
      ? Object.entries(data[selectedCity]).map(([key, value]) => {
        const obj = {
          data: value,
          short_name: key,
          key
        };

        return obj;
      })
      : null;

  useEffect(() => {
    if (data && config.compareCities.cities) {
      const citiesDataObj = {};
      config.compareCities.cities.forEach(obj => {
        citiesDataObj[obj.key] = {
          ...obj,
          data: data[obj.key]
        };
      });

      setCitiesData(citiesDataObj);
      setSelectedCity(config.compareCities.cities[0].key);
    }
  }, [data]);

  console.log({citiesData, indicators});

  return (
    <div className='jobs-container'>
      <div className='jcs-container'>
        <div className='jcs-header'>
          <h5>{config.compareCities?.title || ''}</h5>
          <div className='jobs-legend'>
            <div>
              <svg height={'15px'} width={'15px'}>
                <rect id='main-city-rect' height={'15px'} width={'15px'} />
              </svg>
              {config.title}
            </div>
            <div>
              <svg height={'15px'} width={'15px'}>
                <rect id='compare-cities-rect' height={'15px'} width={'15px'} />
              </svg>
              {'Other benchmark cities'}
            </div>
          </div>
        </div>
        {/* <div className='jcs-buttons-container'>
          {citiesData
            ? Object.keys(citiesData).map(city => (
                <div
                  className={
                    selectedCity === city ? 'selected-jcs-button' : 'unselected-jcs-button'
                  }
                  key={`city-button-${city}-${selectedCity === city ? 'selected' : 'unselected'}`}
                  role='button'
                  onClick={() => setSelectedCity(city)}
                >
                  {citiesData[city].text}
                </div>
              ))
            : null}
        </div> */}
      </div>

      {/* <div className='jobs-charts-wrapper'>
        <div className='jobs-chart-container'>
          <div className='jobs-chart-selected-indicator'>selected indicator</div>
          <div className='jobs-indicators-dropdown'>this is a dropdown</div>
          <div className='jobs-chart'>line chart</div>
        </div>
        <div className='jobs-chart-container'>
          <div className='jobs-chart-selected-indicator'>selected indicator</div>
          <div className='jobs-indicators-dropdown'>this is a dropdown</div>
          <div className='jobs-chart'>bar chart</div>
        </div>
        <div className='jobs-chart-container'>
          <div className='jobs-chart-selected-indicator'>selected indicator</div>
          <div className='jobs-indicators-dropdown'>this is a dropdown</div>
          <div className='jobs-chart'>line chart</div>
        </div>
      </div> */}
    </div>
  );
};

Jobs.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  project: PropTypes.string,
  viewType: PropTypes.string,
  dataManifest: PropTypes.object
};

export default Jobs;
