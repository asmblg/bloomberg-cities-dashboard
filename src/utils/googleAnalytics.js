import capitalizeFirstLetter from './capitalizeFirstLetter';

/**
 * Reports referrer URL to Google Analytics
 * @param {string} referrer URL provided by document.referrer
 */
export const trackReferrer = referrer => {
  if (referrer) {
    window.gtag('event', 'referrer', {
      event_category: 'Referral Source',
      event_label: referrer
    });
  }
};

/**
 * Reports City selected to Google Analytics
 * @param {string} city City link clicked
 */
export const trackCitySelection = city => {
  if (city) {
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
  if (city && tab) {
    const label = `${capitalizeFirstLetter(city)}: ${capitalizeFirstLetter(tab)}`;

    window.gtag('event', 'tab_click', {
      event_category: 'Tab Interaction',
      event_label: label
    });
  }
  return;
};
