import getNestedValue from './getNestedValue';

const getYearFromDateKey = dateKey => {
  if (dateKey === null || dateKey === undefined) {
    return null;
  }

  const keyAsString = String(dateKey);

  if (/^\d{4}$/.test(keyAsString)) {
    return keyAsString;
  }

  const match = keyAsString.match(/(19|20)\d{2}/);
  return match ? match[0] : null;
};

const getTermValue = ({ term, dateKey, data, key, manifest, getSeries }) => {
  if (typeof term?.constant === 'number') {
    return term.constant;
  }

  if (term?.manifestKey && manifest?.[term.manifestKey]) {
    const manifestSeries = manifest[term.manifestKey];
    const directManifestValue = Number(manifestSeries[dateKey]);

    if (Number.isFinite(directManifestValue)) {
      return directManifestValue;
    }

    const yearKey = getYearFromDateKey(dateKey);
    if (yearKey) {
      const annualManifestValue = Number(manifestSeries[yearKey]);
      if (Number.isFinite(annualManifestValue)) {
        return annualManifestValue;
      }
    }

    return 0;
  }

  if (term?.path) {
    const series = getSeries ? getSeries(term.path) : getNestedValue(data, term.path, key);
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

const calculateDataSeries = ({ data, calculation, key, manifest, getSeries }) => {
  if (!data || !calculation?.terms?.length) {
    return null;
  }

  const dateKeys = new Set();
  calculation.terms.forEach(term => {
    if (term?.path) {
      const series = getSeries ? getSeries(term.path) : getNestedValue(data, term.path, key);
      if (series && typeof series === 'object') {
        Object.keys(series).forEach(dateKey => dateKeys.add(dateKey));
      }
    }
  });

  const output = {};
  Array.from(dateKeys).forEach(dateKey => {
    let currentValue = 0;

    calculation.terms.forEach((term, index) => {
      const nextValue = getTermValue({ term, dateKey, data, key, manifest, getSeries });
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
