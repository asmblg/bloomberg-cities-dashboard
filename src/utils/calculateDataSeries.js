import getNestedValue from './getNestedValue';

const getTermValue = ({ term, dateKey, data, key }) => {
  if (typeof term?.constant === 'number') {
    return term.constant;
  }

  if (term?.path) {
    const series = getNestedValue(data, term.path, key);
    const value = series?.[dateKey];
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const applyOperator = (left, operator, right) => {
  switch (operator) {
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return right === 0 ? null : left / right;
    case '+':
    default:
      return left + right;
  }
};

const calculateDataSeries = ({ data, calculation, key }) => {
  if (!data || !calculation?.terms?.length) {
    return null;
  }

  const dateKeys = new Set();
  calculation.terms.forEach(term => {
    if (term?.path) {
      const series = getNestedValue(data, term.path, key);
      if (series && typeof series === 'object') {
        Object.keys(series).forEach(dateKey => dateKeys.add(dateKey));
      }
    }
  });

  const output = {};
  Array.from(dateKeys).forEach(dateKey => {
    let currentValue = 0;

    calculation.terms.forEach((term, index) => {
      const nextValue = getTermValue({ term, dateKey, data, key });
      const operator = index === 0 ? '+' : (term?.operator || '+');
      currentValue = applyOperator(currentValue, operator, nextValue);
    });

    if (currentValue !== null && Number.isFinite(currentValue)) {
      output[dateKey] = currentValue;
    }
  });

  return output;
};

export default calculateDataSeries;
