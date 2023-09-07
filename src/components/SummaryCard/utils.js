export function handleChartCalculator(data, calculator) {
  switch (calculator) {
    case 'total': {
      const obj = {};
      
      Object.entries(data).forEach(([dateKey, valuesObj]) => {
        const total = Object.values(valuesObj).reduce((a, b) => a + b);
        obj[dateKey] = total;
      });
      return obj;
    }
    default: {
      return data;
    }
  }
}