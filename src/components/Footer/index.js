import React from 'react';
import PropTypes from 'prop-types';

// import bloombergLogo from './images/bloomberg_associates.png';
import GoogleTranslate from '../GoogleTranslate';
import config from './config';
import './style.css';

const Footer = () => {
  const { partners, copyright, mainLogo } = config;

  return (
    <div className='footer-container'>
      <div>
        <div className='logo-translator-container'>
          <a
            href='https://associates.bloomberg.org/'
            target='_blank'
            rel='noreferrer'
          >
            <img src={mainLogo} id='bloomberg-logo' />
          </a>
        </div>
        <p>
          <span>&#169;</span> {copyright}
        </p>
      </div>
      <div>
        <GoogleTranslate />
      </div>

      <div>
        <p>Data partners</p>
        <div className='partner-logos-container'>
          {partners.map(({ name, key, url, logo }) => (
            <a
              key={`footer-partner-link-${key}`}
              href={url || '/'}
              target='_blank'
              rel='noreferrer'
            >
              <img
                className='partner-logo'
                src={logo}
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
