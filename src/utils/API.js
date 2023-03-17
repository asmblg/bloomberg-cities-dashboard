import axios from 'axios';
import config from '../config/dashboard.json';

const getConfig = async project => {
  // axios.get('https://bloomberg-cities-api.herokuapp.com/config/', {
  //   params: {
  //     project: project
  //   }
  // });
  const res = config.find(({ project: p }) => p.toLowerCase() === project.toLowerCase());
  return res;
};

const getHomeData = (project, select) =>
  axios.get('http://localhost:3001/data', {
    params: {
      project,
      select: `updatedOn ${select}`
    }
  });

// const getGeoJSON = ({ baseURL, countyfp, statefp }) =>
//   axios.get(baseURL, {
//     params: {
//       where: `COUNTYFP=${countyfp} AND STATEFP=${statefp}`,
//       outFields: 'GEOID',
//       f: 'geojson'
//     }
//   });

export { getConfig, getHomeData };
