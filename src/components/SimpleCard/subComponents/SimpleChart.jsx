import PropTypes from 'prop-types';

import SimpleColumnChart from '../../SimpleColumnChart';
import SinglePercentDonutChart from '../../SinglePercentDonutChart';
import SimpleLineChart from '../../SimpleLineChart.js';

import { handleChartCalculator } from '../utils';

const SimpleChart = ({ 
  config,
  data,
  comparisonData,
  comparisonColors,
  projectedData,
  viewType,
  lng  
}) => {
  const { type } = config;

  // console.log('SimpleChart', {data, projectedData });

  // console.log({config, data, comparisonData});


  switch (type) {
    case 'column': {
      const chartData = config.calculator
        ? handleChartCalculator(data, config.calculator)
        : data;

      return (
        <SimpleColumnChart
          lng={lng}
          config={config}
          data={chartData}
          height={150}
          width={'100%'}
          margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
          hasTooltip
        />
      );
    }
    case 'donut': {
      return (
        <SinglePercentDonutChart
          config={config}
          value={config?.values?.formatter === 'percentX100' 
                  ? data?.value * 100
                  : data?.value}
          values={comparisonData}
          comparisonColors={comparisonColors}          
          label={data?.key}
          height={config?.height || 80}
          innerRadius={config?.innerRadius}
          outerRadius={config?.outerRadius}
          startAngle={config?.startAngle}
          outline={config?.outline}
          width={'100%'}
          mobile={viewType === 'mobile'}
        />
      );
    }
    case 'line': {
      return (
        <SimpleLineChart
          lng={lng}
          config={config}
          data={data}
          projectedData={projectedData}
          comparisonData={comparisonData}
          margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
        />
      );
    }
    case 'donut + line': {
      return (
        <>
          {/* <div style={{ width: '100%', height: 80 }}> */}
              <SinglePercentDonutChart
                config={config}
                value={config?.formatter === 'percentX100' 
                  ? data?.value * 100
                  : data?.value}
                label={data?.key}
                height={80}
                width={'100%'}
                mobile={viewType === 'mobile'}
              />
          {/* </div> */}
          {/* <div style={{ width: '100%', height: 150 }}> */}
            <SimpleLineChart
              lng={lng}
              config={config}
              data={data}
              projectedData={projectedData}
              margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
            />
          {/* </div> */}
        </>
      );
    }
    default: {
      return null;
    }
  }
};

SimpleChart.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  viewType: PropTypes.string
};

export default SimpleChart;
