import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const UserConsentBanner = ({ showBanner, setShowModal, handleUserConsent }) =>
  showBanner && (
    <div className='ucb-container'>
      <div className='ucb-content-container'>
        <p className='ucm-paragraph'>
          We, and third parties, use cookies to improve your user experience. For more information,
          see our{' '}
          <span>
            <a
              className='in-text-link'
              href='https://www.bloomberg.org/legal/'
              target='_blank'
              rel='noreferrer'
            >
              Privacy Policy
            </a>
          </span>
          . By clicking {'"Accept"'}, you agree to the use of cookies. Change your settings anytime
          using our{' '}
          <span onClick={() => setShowModal(true)} className='in-text-link'>
            Cookies Preferences
          </span>
          .
        </p>
      </div>
      <div className='ucb-content-container'>
        <div className='consent-button' role='button' onClick={() => setShowModal(true)}>
          MANAGE PREFERENCES
        </div>

        <div className='consent-button' role='button' onClick={() => handleUserConsent('accept')}>
          ACCEPT
        </div>
      </div>
    </div>
  );

UserConsentBanner.propTypes = {
  setShowModal: PropTypes.func,
  handleUserConsent: PropTypes.func,
  showBanner: PropTypes.bool
};

export default UserConsentBanner;
