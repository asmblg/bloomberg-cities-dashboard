// import moment from 'moment';
import { getData } from '../../utils/API';

const handleHomeData = async (project, summaryCards) => {
  const selectStr = summaryCards.map(({ dataPath }) => `data.${dataPath}`).join(' ');
  const { data: d } = await getData(project, selectStr);

  // console.log(d);

  return { ...d[0].data, updatedOn: d[0].updatedOn };
};

const formatUpdatedOnDate = (date) => {
  const dateObj = new Date(date);
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // January is month 0
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${month}/${day}/${year}`;
};

export { handleHomeData, formatUpdatedOnDate };
