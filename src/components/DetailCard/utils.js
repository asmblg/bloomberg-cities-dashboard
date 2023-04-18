import { getData } from '../../utils/API';
import getNestedValue from '../../utils/getNestedValue';

const handleDetailData = async (config, project) => {
  try {
    let queryString = '';

    if (typeof config.dataPath === 'string') {
      queryString = `data.${config.dataPath}`;
    } else if (Array.isArray(config.dataPath)) {
      config.dataPath.forEach((path, i) => {
        queryString += i === 0 ? `data.${path}` : ` data.${path}`;
      });
    }

    const { data } = await getData(project, queryString);
    const [dataObj] = data;

    const obj = {
      updatedOn: dataObj.updatedOn,
      data: null
    };

    if (typeof config.dataPath === 'string') {
      obj.data = getNestedValue(dataObj, queryString);
    } else if (Array.isArray(config.dataPath)) {
      obj.data = {};
      config.dataPath.forEach(path => {
        obj.data[path] = getNestedValue(dataObj.data, path);
      });
    }
    return obj;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export { handleDetailData };
