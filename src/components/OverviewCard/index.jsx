import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import DashboardTitle from '../DashboardTitle';

import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import './style.css';

const OverviewCard = ({ viewType, config, project }) => {
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [displayingSection, setDisplayingSection] = useState('about');
  const projectCity = capitalizeFirstLetter(project);

  return (
    <>
      {overviewOpen && config ? (
        <>
          {viewType === 'desktop'|| viewType === 'tablet' ? (
            <div className='overview-title'>
              <DashboardTitle title={config.title}/>
            </div>
          ) : null}

          <div className='overview-body'>
            <div className='overview-text-body'>
              <h5>{`${projectCity.toUpperCase()} METRO ECONOMIC DATA.`}</h5>
              <h5>UPDATED QUARTERLY.</h5>
            </div>

            <div className='overview-dropdown-container'>
              <div
                className='overview-dropdown-header'
                onClick={() => {
                  if (displayingSection !== 'about') {
                    setDisplayingSection('about');
                  } else {
                    setDisplayingSection('use');
                  }
                }}
              >
                <div>
                  <Icon name={`angle ${displayingSection === 'about' ? 'down' : 'up'}`} />
                </div>

                <h5>About the dashboard</h5>
              </div>
              {displayingSection === 'about' ? (
                <div className='overview-text-body'>
                  <p>
                    {`Bloomberg Associates and the City of ${projectCity} built this dashboard to provide insight and key metrics about our community, businesses, and residents to help make more informed decisions.`}
                  </p>
                  <p>
                    {`If you have any questions about the data or are a business interested in connecting with ${
                      config?.cityContact?.title || `City of ${projectCity}`
                    }, `}
                    <a
                      className='overview-contact-link'
                      href={config?.cityContact?.link || '#'}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <span style={{ textDecoration: 'underline' }}>click here</span>.
                    </a>
                  </p>
                </div>
              ) : null}
            </div>
            <div className='overview-dropdown-container'>
              <div
                className='overview-dropdown-header'
                onClick={() => {
                  if (displayingSection !== 'use') {
                    setDisplayingSection('use');
                  } else {
                    setDisplayingSection('about');
                  }
                }}
              >
                <div>
                  <Icon name={`angle ${displayingSection === 'use' ? 'down' : 'up'}`} />
                </div>
                <h5>How to use this dashboard</h5>
              </div>
              {displayingSection === 'use' ? (
                <div className='overview-text-body'>
                  <p>
                    The home screen shows one key indicator per topic. Click on the charts to see
                    more detailed information.
                  </p>
                  <p>Use the tabs to explore additional indicators for each topic.</p>
                  <p>
                    Learn where the data comes from in the &quot;About the data&quot; section on the
                    top menu.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
      {viewType === 'mobile' ? (
        <div className='overview-arrow-container'>
          <Icon
            name={`angle ${overviewOpen ? 'down' : 'up'}`}
            size='big'
            link
            onClick={() => setOverviewOpen(!overviewOpen)}
          />
        </div>
      ) : null}
    </>
  );
};

OverviewCard.propTypes = {
  viewType: PropTypes.string,
  config: PropTypes.object,
  project: PropTypes.string
};

export default OverviewCard;
