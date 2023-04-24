
const formatQuarterDate = (date, format) => {
  const textArray = date.search(' ') !== -1 ?
    date.split(' ')
    : date.search('-') !== -1 ?
      date.split('-')
      : null;
  if (textArray && format) {
    if (format === 'QX YYYY') {
      if (textArray?.[1]?.match(/q/i)) {
        return textArray.reverse().join(' ');
      }
      if (textArray?.[0]?.match(/q/i)) {
        return textArray.join(' ');
      }    
    } 
  } else {
    return date;
  }

};

export default formatQuarterDate;