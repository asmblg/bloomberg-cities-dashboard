import axios from 'axios';
// import config from '../../dev/dev-configs.json';

// const localConfig = import.meta.env.VITE_MODE === 'local';
// console.log('localConfig', localConfig);

const isStagingEnabled = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return new URLSearchParams(window.location.search).get('staging') === 'true';
};

const withStagingParam = params => (
  isStagingEnabled()
    ? { ...params, staging: true }
    : params
);

const getConfig = async (projectCity, lng) => {

  // if (!localConfig) {
    const res = await axios.get(`/ui/config`, {
      params: withStagingParam(
        lng
          ? {
              project: projectCity,
              lng
            }
          : {
              project: projectCity
            }
      )
    });

    // console.log('res in getConfig', res);
    return res?.data?.[0];
  // } else {
    // LOCAL CONFIG FOR DEV
    // const config = require(`../../dev-configs.json`);
    // console.log('config in getConfig', config);
    // return await new Promise((resolve, reject) => {
    //   const res = config;
  
    //   if (res.length >= 1) {
    //     const obj = res.find(
    //       ({ project }) => project.toLowerCase() === projectCity.toLowerCase()
    //     );
    //     resolve(obj || res[0]);
    //   } else {
    //     reject('No local config');
    //   }
  
    // });
  // }
};

const getData = (project, select) =>
  axios.get(`/ui/data`, {
    params: withStagingParam({
      project,
      select: `updatedOn ${select}`
    })
  });

const getTractGeoJSON = project =>
  axios.get(`/ui/geo`, {
    params: withStagingParam({
      project,
      geoType: 'Census Tracts'
    })
  });

const getGeoJSON = (project, geoType) =>
  axios.get(`/ui/geo`, {
    params: withStagingParam({
      project,
      geoType
    })
  });

export { getConfig, getData, getTractGeoJSON, getGeoJSON };
