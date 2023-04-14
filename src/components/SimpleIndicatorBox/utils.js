import getNestedValue from '../../utils/getNestedValue';
import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';

const handleDisplayObject = ({ data, selectedIndicator, selectedCategory, dataPath }) => {
  const obj = {
    date: null,
    value: null
  };

  const nestedDataObj =
      dataPath && selectedCategory?.key
        ? getNestedValue(data, `${dataPath}.${selectedCategory.key}${selectedIndicator?.key ? `.${selectedIndicator.key}` : null}`)
        : dataPath && !selectedCategory
          ? getNestedValue(data, dataPath)
          : !dataPath && !selectedCategory
            ? { ...data }
            : null;

  if (nestedDataObj && selectedIndicator) {
    const [mostRecentQuarter] = getRecentQuarterEndDates(Object.keys(nestedDataObj), 1);
    obj.date = mostRecentQuarter;
    obj.value = nestedDataObj[mostRecentQuarter];
  }
  return obj;
};

export { handleDisplayObject };
