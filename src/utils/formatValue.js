import formatNumberWithCommas from './formatNumberWithCommas';

const formatValue = (value, formatter) => {
  const string = formatter !== 'abbreviateNumber' ? formatNumberWithCommas(value) : `${value}`;

  switch (formatter) {
    case 'percent': {
      return `${string}%`;
    }
    default: {
      return string;
    }
  }
};

export default formatValue;
