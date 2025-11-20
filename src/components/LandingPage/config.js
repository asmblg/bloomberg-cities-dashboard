// import tampaBW from './images/tampa-bg-bw.jpg';
// import tampaColor from './images/tampa-bg-color.jpg';
// import phoenixBW from './images/phoenix-bg-bw.jpg';
// import phoenixColor from './images/phoenix-bg-color.jpg';
// import baltimoreBW from './images/baltimore-bg-bw.png';
// import baltimoreColor from './images/baltimore-bg-color.png';

const landingConfig = {
  themeColor: '#e16724',
  infoSection: {
    logo: '',
    title: 'EU Economic Dashboards',
    textBoxes: ['CITY-LEVEL ECONOMIC DATA.', 'UPDATED QUARTERLY.'],
    paragraph:
      'Bloomberg Associates, the philanthropic consulting arm of Bloomberg Philanthropies, partnered with cities to create dashboards that provide a detailed view into local key economic indicators in real-time, helping the city and county government officials, philanthropy, and community groups make smarter, more targeted investments.'
  },
  citiesSection: {
    title: 'SELECT A CITY TO EXPLORE THE DASHBOARD',
    cities: [
      {
        id: 'lisboa',
        name: 'LISBOA',
        route: 'https://www.lisboa.pt/temas/economia/dados-economicos/indicadores-principais',
        img: null,
        hoverImg: null
      },
      // {
      //   id: 'tampa',
      //   name: 'TAMPA',
      //   route: '/tampa',
      //   bgColor: '#006aaf',
      //   img: tampaBW,
      //   hoverImg: tampaColor
      // },
      // {
      //   id: 'baltimore',
      //   name: 'BALTIMORE',
      //   route: '/baltimore',
      //   bgColor: '#b02365',
      //   img: baltimoreBW,
      //   hoverImg: baltimoreColor
      // }
    ]
  }
};

export default landingConfig;
