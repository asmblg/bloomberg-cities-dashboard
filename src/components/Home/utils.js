// import moment from 'moment';
import { getHomeData } from '../../utils/API';

const handleHomeData = async (project, summaryCards) => {
  const selectStr = summaryCards.map(({ dataPath }) => `data.${dataPath}`).join(' ');
  const { data: d } = await getHomeData(project, selectStr);

  return { ...d[0].data, updatedOn: d[0].updatedOn };
};

export { handleHomeData };
