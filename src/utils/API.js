import axios from 'axios';
import config from '../dev/configs.json';

const baseURL = 'https://bloomberg-cities-api.herokuapp.com'; 

const getConfig = async (projectCity) => {
  // const res =  await axios.get('https://bloomberg-cities-api.herokuapp.com/config/', {
  //   params: {
  //     project: projectCity
  //   }
  // });

  // return res?.data?.[0];

  // LOCAL CONFIG FOR DEV
  const res = config;
  
  if (res.length > 1) {
    const obj = res.find(
      ({ project }) => project.toLowerCase() === projectCity.toLowerCase()
    );
    return obj || res[0];
  }

};

const getData = (project, select) =>
  // axios.get('https://bloomberg-cities-api.herokuapp.com/data', {
  //   params: {
  //     project,
  //     select: `updatedOn ${select}`
  //   }
  axios.get('http://localhost:3001/data', {
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
