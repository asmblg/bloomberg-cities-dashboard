const landingConfig = {
  themeColor: '#e16724',
  infoSection: {
    logo: '',
    title: 'Economic Dashboards',
    textBoxes: [
      'CITY LEVEL ECONOMIC DATA. UPDATED QUARTERLY.',
      '20+ Economic indicators and 15+ socioeconomic and demographic variables to explore for each city.'
    ]
  },
  citiesSection: {
    title: 'SELECT A CITY TO EXPLORE THE DASHBOARD',
    cities: [
      {
        id: 'phoenix',
        name: 'PHOENIX',
        route: '/phoenix',
        bgColor: '#b02365'
      },
      {
        id: 'tampa',
        name: 'TAMPA',
        route: '/tampa',
        bgColor: '#006aaf'
      }
    ]
  }
};

export default landingConfig;
