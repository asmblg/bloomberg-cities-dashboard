import axios from "axios"
const getConfig = project => axios.get(
  'https://bloomberg-cities-api.herokuapp.com/config/', {
  params: {
    project: project
  }
});

const getCityData = project => axios.get(
  'https://bloomberg-cities-api.herokuapp.com/data/', {
  params: {
    project: project,
    select: 'data.city'
  }
});

const getGeoJSON = ({baseURL, countyfp, statefp}) => axios.get(
  baseURL, {
    params: {
      where: `COUNTYFP=${countyfp} AND STATEFP=${statefp}`,
      outFields: 'GEOID',
      f: 'geojson'
    }
  }
); 

export {
  getConfig,
  getCityData,
  getGeoJSON
}