import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './style.css';

const UserConsentModal = ({ showModal, setShowModal, handleUserConsent }) =>
  showModal && (
    <div className='ucm-overlay'>
      <div className='ucm-container'>
        <div className='ucm-content'>
          <div className='ucm-close-container'>
            <span className='ucm-close-button' onClick={() => setShowModal(false)}>
              <Icon name='close' />
            </span>
          </div>

          <h1 className='ucm-title'>Your choice regarding cookies on this website:</h1>
          <p className='ucm-paragraph'>
            We, and third parties, use cookies and other electronic tools to enhance your
            experience, analyze site usage, and deliver advertisements tailored to your interests.
            For more information, please read our{' '}
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
            . By clicking {'"Accept"'}, you will save your cookie settings and agree to the use of
            these tools.
          </p>
          <h2 className='ucm-section-title'>Required</h2>
          <p className='ucm-paragraph'>
            These cookies are required to enable core site functionality.
          </p>
          <ul className='ucm-list'>
            <li>Google Tag Manager</li>
          </ul>
          <h2 className='ucm-section-title'>Performance</h2>
          <p className='ucm-paragraph'>
            These cookies allow us to analyze site usage so we can measure and improve performance.
            In order to opt-out, please click on the link(s) below.
          </p>
          <ul className='ucm-list'>
            <li>
              <a
                className='ucm-link'
                href={'https://tools.google.com/dlpage/gaoptout'}
                target='_blank'
                rel='noreferrer'
              >
                Google Analytics
              </a>
            </li>
          </ul>
          <div className='ucm-button-container'>
            <div
              className='consent-button'
              role='button'
              onClick={() => {
                handleUserConsent('accept');
                setShowModal(false);
              }}
            >
              ACCEPT
            </div>
            <div
              className='consent-button'
              role='button'
              onClick={() => {
                handleUserConsent('decline');
                setShowModal(false);
              }}
            >
              REJECT
            </div>
          </div>
          <p className='ucm-paragraph'>
            By clicking {'"Accept"'}, you are saving your cookie settings and agreeing to the use of
            these tools. You can change your settings at anytime using the Cookies Preferences link
            in the footer of this website.
          </p>
        </div>
      </div>
    </div>
  );

UserConsentModal.propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  handleUserConsent: PropTypes.func
};

export default UserConsentModal;
