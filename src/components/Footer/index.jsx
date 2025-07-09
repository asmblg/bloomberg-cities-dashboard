// import React from 'react';
import PropTypes from 'prop-types';
import bloombergLogo from '../../assets/logos/bloomberg_associates.png';
import alignableLogo from './logos/alignable.png';
// import blockLogo from './logos/block.png';
import deweyLogo from './logos/dewey.png';
import jllLogo from './logos/jll.png';
import dealroomLogo from './logos/dealroom.png';
import safeGraphLogo from './logos/SafeGraph.png';
import lightcastLogo from './logos/lightcast.png';
import gustoLogo from './logos/gusto.png';

import jllLogoBlack from './logos/jll_black.png';
import informaLogo from './logos/informa_black.png';
import lightcastLogoBlack from './logos/lightcast_black.png';
import sibsLogo from './logos/sibs_black.png';
import lisboaAbertaLogo from './logos/lisboa_aberta_black.png';
import lisboaInnovationLogo from './logos/lisboa_innovation_black.png';




// import bloombergLogo from './images/bloomberg_associates.png';
import GoogleTranslate from '../GoogleTranslate';
import config from './config';
import './style.css';

const logos = {
  bloombergLogo,
  alignableLogo,
  deweyLogo,
  jllLogo,
  dealroomLogo,
  safeGraphLogo,
  lightcastLogo,
  gustoLogo,
  sibsLogo,
  informaLogo,
  lisboaAbertaLogo,
  jllLogoBlack,
  lightcastLogoBlack,
  lisboaInnovationLogo,
};

const Footer = ({ setShowModal, noLogo, style, disableGoogleTranslate, dataPartners, invertLogos, disableUserConsent }) => {
  const { partners, copyright, mainLogoKey } = config;

  return (
    <div className='footer-container' style={{ ...style }}>
      <div>
        <div className='logo-translator-container'>
          { !noLogo  
            ? <a href='https://associates.bloomberg.org/' target='_blank' rel='noreferrer'>
              <img src={logos[mainLogoKey]} id='bloomberg-logo' alt='Bloomberg Associates Logo' />
            </a>
            : null
          }
        </div>
        <p className='copyright'>
          <span>&#169;</span> {copyright}
        </p>
        {
          !disableUserConsent &&
          <p className='in-text-link' onClick={() => setShowModal(true)}>
            Cookies Preferences
          </p>
      }
      </div>
      <div>
        {
          !disableGoogleTranslate &&
            <GoogleTranslate />
        } 
      </div>

      <div>
        <p style={{fontFamily: 'var(--font-family-light)'}}>Data partners:</p>
        <div className='partner-logos-container'>
          {[...dataPartners || partners].map(({ name, key, url, logoKey, style, invert }) => (
            <a
              key={`footer-partner-link-${key}`}
              href={url || '/'}
              target='_blank'
              rel='noreferrer'
            >
              <img
                className='partner-logo'
                style={invertLogos || invert
                  ? { filter: 'invert(1)', ...style || {}} 
                  : {...style || {}}}
                src={logos[logoKey]}
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
