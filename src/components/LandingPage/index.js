import React, { useState } from 'react';
import PropTypes from 'prop-types';

import config from './config';
import './style.css';
import bbLogo from '../../assets/logos/bloomberg_associates.png';

const LandingPage = ({ viewType }) => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const { themeColor, infoSection, citiesSection } = config;

  return (
    <div className='landing-wrapper' style={{ display: 'block' }}>
      <div
        style={{
          width: '100%',
          height: '50px',
          backgroundColor: themeColor
        }}
      />
      <div className='landing-container'>
        <div className='landing-info-container'>
          <div className='landing-info-content'>
            <a href='https://associates.bloomberg.org/' target='_blank' rel='noreferrer'>
              <img src={bbLogo} alt='Bloomberg Logo' />
            </a>
            <h1 className='bold-font' style={{ color: themeColor }}>
              {infoSection.title.toUpperCase()}
            </h1>
            {infoSection.textBoxes.map((text, i) => (
              <h5 key={`landing-info-text-${i}`}>{text}</h5>
            ))}
          </div>
        </div>

        <div className='landing-cities-container'>
          <div className='landing-cities-content'>
            <h5>{citiesSection.title}</h5>
            <div className='landing-city-links'>
              {citiesSection.cities.map(({ id, name, route, img, hoverImg }) => (
                <a
                  key={`landing-city-${id}`}
                  className='landing-city-box'
                  href={route}
                  style={{
                    backgroundImage: `url(${
                      hoveredLink === id || viewType !== 'desktop' ? hoverImg : img
                    })`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }}
                  onMouseEnter={() => setHoveredLink(id)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <div style={{ backgroundColor: 'var(--black-color)' }}>
                    <h1
                      style={{ color: 'var(--white-color)', margin: '10px' }}
                      className='bold-font'
                    >
                      {name}
                    </h1>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LandingPage.propTypes = {
  viewType: PropTypes.string
};

export default LandingPage;
