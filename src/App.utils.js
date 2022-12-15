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
})

export {
  getConfig,
  getCityData
}