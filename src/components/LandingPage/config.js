import tampaBW from './images/tampa-bg-bw.jpg';
import tampaColor from './images/tampa-bg-color.jpg';
import phoenixBW from './images/phoenix-bg-bw.jpg';
import phoenixColor from './images/phoenix-bg-color.jpg';

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
        bgColor: '#b02365',
        img: phoenixBW,
        hoverImg: phoenixColor
      },
      {
        id: 'tampa',
        name: 'TAMPA',
        route: '/tampa',
        bgColor: '#006aaf',
        img: tampaBW,
        hoverImg: tampaColor
      }
    ]
  }
};

export default landingConfig;
