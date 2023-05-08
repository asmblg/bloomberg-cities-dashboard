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
        <a
          href='https://associates.bloomberg.org/'
          target='_blank'
          rel='noreferrer'
        >
          <img src={footerLogos.bloomberg} id='bloomberg-logo' />
        </a>
        <p>
          <span>&#169;</span> {copyright}
        </p>
      </div>
      <div>
        <p>Data partners</p>
        <div className='partner-logos-container'>
          {partners.map(({ name, key, url }) => (
            <a
              key={`footer-partner-link-${key}`}
              href={url || '/'} target='_blank'
              rel='noreferrer'
            >
              <img
                className='partner-logo'
                src={footerLogos[key]}
                alt={`${name} Logo and link to website`}
                id={`${key}-footer-logo`}
              />
            </a>
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
