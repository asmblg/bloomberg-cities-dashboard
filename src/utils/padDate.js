

const padDate = (dateString, seperator) => dateString.split(seperator || '-').map(string => 
  string.length === 1
    ? `0${string}`
    : string
).join(seperator || '-');

export default padDate;