import capitalizeFirstLetter from './capitalizeFirstLetter';
const GA_TRACKING_ID = 'G-RKDT2C9ZHZ';

/**
 * Adds or removes Google Analytics scripts based on user preference
 * @param {boolean} addScript determines if we are adding or removing the scripts
 */
export const handleGoogleAnalyticsScript = addScript => {
  if (addScript) {
    const libScript = document.createElement('script');
    libScript.id = 'google-tag-manager-script';
    libScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    libScript.async = true;
    document.head.appendChild(libScript);

    libScript.onload = () => {
      const initScript = document.createElement('script');
      initScript.id = 'g-tag-function-script';
      initScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }

        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}')
        `;

      document.head.appendChild(initScript);
    };
  } else {
    const libScript = document.getElementById('google-tag-manager-script');

    if (libScript) {
      libScript.parentNode.removeChild(libScript);
    }

    const initScript = document.getElementById('g-tag-function-script');

    if (initScript) {
      initScript.parentNode.removeChild(initScript);
      window.gtag = null;
    }
  }
};

/**
 * Reports City selected to Google Analytics
 * @param {string} city City link clicked
 */
export const trackCitySelection = city => {
  // window.gtag only present when cookies accepted by user
  if (city && window.gtag) {
    window.gtag('event', 'city_click', {
      event_category: 'City Selection',
      event_label: capitalizeFirstLetter(city)
    });
  }
};

/**
 * Reports city-tab clicked to Google Analytics
 * @param {string} city current city user is viewing
 * @param {string} tab Tab clicked
 */
export const trackTabClick = async (city, tab) => {
  // window.gtag only present when cookies accepted by user
  if (city && tab && window.gtag) {
    const label = `${capitalizeFirstLetter(city)}: ${capitalizeFirstLetter(tab)}`;

    window.gtag('event', 'tab_click', {
      event_category: 'Tab Interaction',
      event_label: label
    });
  }
  return;
};
