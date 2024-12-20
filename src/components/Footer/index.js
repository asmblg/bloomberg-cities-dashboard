import React from 'react';
import PropTypes from 'prop-types';

// import bloombergLogo from './images/bloomberg_associates.png';
import GoogleTranslate from '../GoogleTranslate';
import config from './config';
import './style.css';

const Footer = ({ setShowModal, noLogo }) => {
  const { partners, copyright, mainLogo } = config;

  return (
    <div className='footer-container'>
      <div>
        <div className='logo-translator-container'>
          { !noLogo  
            ? <a href='https://associates.bloomberg.org/' target='_blank' rel='noreferrer'>
              <img src={mainLogo} id='bloomberg-logo' />
            </a>
            : null
          }
        </div>
        <p>
          <span>&#169;</span> {copyright}
        </p>
        <p className='in-text-link' onClick={() => setShowModal(true)}>
          Cookies Preferences
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
  setShowModal: PropTypes.func,
  noLogo: PropTypes.bool
};

export default Footer;
