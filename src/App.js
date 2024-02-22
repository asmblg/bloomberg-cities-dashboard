import './App.css';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

import Layout from './components/Layout';
import UserConsentBanner from './components/UserConsentBanner';
import UserConsentModal from './components/UserConsentModal';

import { handleConfig, handleRootVariables } from './App.utils';
import { handleGoogleAnalyticsScript } from './utils/googleAnalytics';

const App = () => {
  const userConsent = localStorage.getItem('cookieConsent');

  const [config, setConfig] = useState(null);
  const [cookiesAccepted, setCookiesAccepted] = useState(userConsent === 'true');
  const [showBanner, setShowBanner] = useState(userConsent !== 'true' && userConsent !== 'false');
  const [showModal, setShowModal] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleUserConsent = action => {
    localStorage.setItem('cookieConsent', action === 'accept' ? 'true' : 'false');
    setCookiesAccepted(action === 'accept');

    if (action === 'accept' || action === 'decline') {
      setShowBanner(false);
    }
  };

  // Get Config
  useEffect(() => {
    let controller = true;

    if (pathname !== '/') {
      handleConfig(pathname).then(({ config: c, redirect }) => {
        if (c && controller) {
          handleRootVariables(c).then(() => setConfig(c));
        }

        if (!c && controller && redirect) {
          // console.log('redirect');
          navigate(redirect);
        }
      });
    }
    // Cleanup
    return () => {
      controller = false;
    };
  }, []);

  // Google Analytics
  useEffect(() => {
    if (userConsent === 'true' || userConsent === 'false') {
      handleGoogleAnalyticsScript(cookiesAccepted);
    }
  }, [cookiesAccepted, userConsent]);

  return (
    <div className='App'>
      {config || pathname === '/' ? (
        <>
          <Layout config={config} setShowModal={setShowModal} />
          <UserConsentBanner
            key={`user-consent-banner-display-${showBanner}`}
            showBanner={showBanner}
            handleUserConsent={handleUserConsent}
            setShowModal={setShowModal}
          />
          <UserConsentModal
            key={`user-consent-modal-display-${showModal}`}
            showModal={showModal}
            setShowModal={setShowModal}
            handleUserConsent={handleUserConsent}
          />
        </>
      ) : (
        <TailSpin
          color={'#006aaf'}
          width={200}
          height={200}
          wrapperStyle={{
            width: '100vw',
            justifyContent: 'center',
            paddingTop: 'calc(50vh - 250px)'
          }}
        />
      )}
    </div>
  );
};

export default App;
