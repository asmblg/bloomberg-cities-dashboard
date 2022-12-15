import axios from "axios";

const getTractData = ({project, category, indicator}) => axios.get(
  'https://bloomberg-cities-api.herokuapp.com/data/', {
  params: {
    project: project,
    select: `data.tract.${category}.${indicator}`
  }
});

export {
  getTractData
}