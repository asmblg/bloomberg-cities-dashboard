import axios from 'axios';
// import config from '../config/dashboard.json';

const getConfig = async (projectCity) => {
 
  const res =  await axios.get('https://bloomberg-cities-api.herokuapp.com/config/', {
    params: {
      project: projectCity
    }
  });

  // console.log(res);
  // config.filter(({ project }) => project.toLowerCase() === projectCity.toLowerCase());

  // if (res.length > 1) {
  //   const obj = res.find(
  //     ({ dashboardType }) => dashboardType.toLowerCase() === projectType.toLowerCase()
  //   );
  //   return obj || res[0];
  // }

  return res.data[0];
};

const getData = (project, select) =>
  axios.get('https://bloomberg-cities-api.herokuapp.com/data', {
    params: {
      project,
      select: `updatedOn ${select}`
    }
  });

const getTractGeoJSON = project =>
  axios.get('https://bloomberg-cities-api.herokuapp.com/geo', {
    params: {
      project,
      geoType: 'Census Tracts'
    }
  });

const getGeoJSON = (project, geoType) =>
  axios.get('https://bloomberg-cities-api.herokuapp.com/geo', {
    params: {
      project,
      geoType
    }
  });

export { getConfig, getData, getTractGeoJSON, getGeoJSON };
