import React from 'react';
import PropTypes from 'prop-types';

// import bloombergLogo from './images/bloomberg_associates.png';
import { footerLogos } from './config';
import './style.css';

const Footer = ({ config }) => {
  const { partners, copyright } = config;

  return (
    <div className='footer-container'>
      <div>
        <img src={footerLogos.bloomberg} className='bloomberg-logo' />
        <p>
          <span>&#169;</span> {copyright}
        </p>
      </div>
      <div>
        <p>Data partners</p>
        <div className='partner-logos-container'>
          {partners.map(({ name, key }) => (
            <img
              key={`footer-partner-logo-${key}`}
              src={footerLogos[key]}
              alt={`${name} Logo`}
              id={`${key}-footer-logo`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  config: PropTypes.object
};

export default Footer;
