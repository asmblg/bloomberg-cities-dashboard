import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import IndicatorLineChart from '../IndicatorLineChart';
// import IndicatorDropdown from '../IndicatorDropdown';

import './style.css';

const Jobs = ({ config, data, project }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (config?.compareCities?.cities && config.compareCities.cities[0]) {
      setSelectedCity(config.compareCities.cities[0].key);
    } 
  }, []);

  return data && data[project] ? (
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
        <div className='jcs-buttons-container'>
          {config?.compareCities?.cities && config.compareCities.cities[0] 
            ? config.compareCities.cities.map(({ key, text }) => (
              <div
                className={
                  selectedCity === key ? 'selected-jcs-button' : 'unselected-jcs-button'
                }
                key={`city-button-${key}-${selectedCity === key ? 'selected' : 'unselected'}`}
                role='button'
                onClick={() => setSelectedCity(key)}
              >
                {text}
              </div>
            ))
            : null}
        </div>
      </div>
      <div className='jobs-charts-wrapper'>
        {config.charts && config.charts[0]
          ? config.charts.map((chart, i) => chart.type === 'multi-line' ? (
            <div key={`jobs-multiline-chart-${i}`} className='jobs-chart-container'>
              <IndicatorLineChart
                mainLine={project}
                compareLine={selectedCity}
                config={chart}
                data={data}
              />
            </div>
          ) : null)
          : null}
      </div>
    </div>
  ) : null;
};

Jobs.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  project: PropTypes.string,
  viewType: PropTypes.string,
  dataManifest: PropTypes.object
};

export default Jobs;
