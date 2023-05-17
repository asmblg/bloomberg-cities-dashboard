import bloombergLogo from '../../assets/logos/bloomberg_associates.png';
import alignableLogo from './logos/alignable.png';
import blockLogo from './logos/block.png';
import deweyLogo from './logos/dewey.png';
import jllLogo from './logos/jll.png';
import dealroomLogo from './logos/dealroom.png';
import SafeGraphLogo from './logos/SafeGraph.png';

const footerConfig = {
  mainLogo: bloombergLogo,
  copyright: '2023 Bloomberg Associates. All Rights Reserved.',
  partners: [
    {
      key: 'dealroom',
      name: 'Dealroom.co',
      url: ' https://dealroom.co/',
      logo: dealroomLogo
    },
    {
      key: 'alignable',
      name: 'Alignable',
      url: 'https://www.alignable.com/',
      logo: alignableLogo
    },
    {
      key: 'jll',
      name: 'JLL',
      url: 'https://www.us.jll.com/',
      logo: jllLogo
    },
    {
      key: 'dewey',
      name: 'Dewey',
      url: 'https://www.deweydata.io/',
      logo: deweyLogo
    },
    {
      key: 'safeGraph',
      name: 'SafeGraph',
      url: 'https://www.safegraph.com/',
      logo: SafeGraphLogo
    },
    {
      key: 'block',
      name: 'Block',
      url: 'https://block.xyz/',
      logo: blockLogo
    }
  ]
};

export default footerConfig;
