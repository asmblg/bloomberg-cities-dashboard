import './App.css';
import { useState, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

import Layout from './components/Layout';
import UserConsentBanner from './components/UserConsentBanner';
import UserConsentModal from './components/UserConsentModal';

import { 
  handleConfig, 
  handleRootVariables, 
  useAutoIframeHeight 
} from './App.utils';
import { handleGoogleAnalyticsScript } from './utils/googleAnalytics';
import '@iframe-resizer/child'


// import useAutoIframeHeight from './hooks/useAutoIframeHeight'; // 👈 import the hook

const App = () => {
  const userConsent = localStorage.getItem('cookieConsent');

  const [config, setConfig] = useState(null);
  const [cookiesAccepted, setCookiesAccepted] = useState(userConsent === 'true');
  const [showBanner, setShowBanner] = useState(userConsent !== 'true' && userConsent !== 'false');
  const [showModal, setShowModal] = useState(false);

  const { pathname, search } = useLocation();
  const queryParams = new URLSearchParams(search);
  // const dev = queryParams.get('dev') === 'true' || false;
  const lng = queryParams.get('lng') || null;

  const navigate = useNavigate();

  // 🔄 Auto-resize iframe height
  useAutoIframeHeight([pathname]); // 👈 Re-trigger on route change

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
      handleConfig(pathname, lng).then(({ config: c, redirect }) => {
        if (c && controller) {
          handleRootVariables(c).then(() => setConfig(c));
        }

        if (!c && controller && redirect) {
          navigate(redirect);
        }
      });
    }
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

  // Numeric format region from config (URL param still has precedence in formatters)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__numericFormatRegion = config?.numericFormatRegion || null;
    }
  }, [config?.numericFormatRegion]);

  return (
    <div className='App'>
      {config || pathname === '/' ? (
        <>
          <Layout config={config} setShowModal={setShowModal} />
          {
            !config?.disableConsentModal && <UserConsentBanner
              key={`user-consent-banner-display-${showBanner}`}
              showBanner={showBanner}
              handleUserConsent={handleUserConsent}
              setShowModal={setShowModal}
            />
          }
          {
            !config?.disableConsentModal && <UserConsentModal
              key={`user-consent-modal-display-${showModal}`}
              showModal={showModal}
              setShowModal={setShowModal}
              handleUserConsent={handleUserConsent}
            />
          }

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
