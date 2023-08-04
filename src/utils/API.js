import axios from 'axios';
const baseURL = 'https://bloomberg-cities-api.herokuapp.com'; //' http://localhost:3001';

const getConfig = async (projectCity) => {

 
  const res =  await axios.get(`${baseURL}/config/`, {
    params: {
      project: projectCity
    }
  });

  console.log(res?.data);

  return res?.data?.[0];

  // LOCAL CONFIG FOR DEV
  // const res = config;
  
  // if (res.length > 1) {
  //   const obj = res.find(
  //     ({ project }) => project.toLowerCase() === projectCity.toLowerCase()
  //   );
  //   return obj || res[0];
  // }

};

const getData = (project, select) =>
  axios.get(`${baseURL}/data`, {
    params: {
      project,
      select: `updatedOn ${select}`
    }
  });

const getTractGeoJSON = project =>
  axios.get(`${baseURL}/geo`, {
    params: {
      project,
      geoType: 'Census Tracts'
    }
  });

const getGeoJSON = (project, geoType) =>
  axios.get(`${baseURL}/geo`, {
    params: {
      project,
      geoType
    }
  });

export { getConfig, getData, getTractGeoJSON, getGeoJSON };
