import axios from 'axios';
import config from '../dev/configs.json';

const dev = true;
const prodURL = 'https://bloomberg-cities-api.herokuapp.com';
const devURL = 'http://localhost:3001';
const baseURL = !dev ? prodURL : devURL;
const localConfig = true;

const getConfig = async projectCity => {
  if (!localConfig) {
    const res = await axios.get(`${baseURL}/config`, {
      params: {
        project: projectCity
      }
    });

    return res?.data?.[0];
  } else {
    // LOCAL CONFIG FOR DEV
    return await new Promise((resolve, reject) => {
      const res = config;
  
      if (res.length >= 1) {
        const obj = res.find(
          ({ project }) => project.toLowerCase() === projectCity.toLowerCase()
        );
        resolve(obj || res[0]);
      } else {
        reject('No local config');
      }
  
    });
  }
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
