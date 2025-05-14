import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

import CustomTooltip from '../CustomTooltip';

import './style.css';

const SinglePercentDonutChart = ({ config, height, width, value, label, mobile }) => {
  const multiplier = config?.values?.multiplier || 1;
  
  const dataArray = value
    ? [
      {
        name: label,
        value: parseFloat(value * multiplier),
        fillColor: config?.color || '#333333'
      },
      {
        name: label,
        value: 100 - parseFloat(value * multiplier),
        fillColor: config?.accentColor || '#E0E0E0'
      }
    ]
    : [];

  return dataArray ? (
    <ResponsiveContainer height={height} width={width}>
      <PieChart>
        {/* <Pie
            data={[{value: 100}]}
            dataKey={'value'}
            cx={mobile ? '65%' : '50%'}
            cy={'50%'}
            outerRadius={mobile ? '100%' : '80%'}
            innerRadius={mobile ? '50%' : '40%'}
            startAngle={-345}
            stroke='black'
            strokeWidth={0.1}
          /> */}
        <Pie
          data={dataArray}
          dataKey={'value'}
          cx={mobile ? '65%' : '50%'}
          cy={'50%'}
          outerRadius={mobile ? '100%' : '80%'}
          innerRadius={mobile ? '50%' : '40%'}
          startAngle={-345}
          // endAngle={90}
        > 

          {dataArray.map(({ fillColor, value }, i) => (
            <Cell 
              key={`donut-chart-cell-${value}-${i}`} 
              fill={fillColor} 
              // stroke='black'
              // strokeWidth={0.5}
    
            />
          ))}
        </Pie>
        {/* <Pie
          data={[{value: 100}]}
          dataKey={'value'}
          cx={mobile ? '65%' : '50%'}
          cy={'50%'}
          outerRadius={mobile ? '100%' : '80%'}
          innerRadius={mobile ? '50%' : '40%'}
          startAngle={-345}
          stroke='black'
          strokeWidth={0.5}
          fill='transparent'
        /> */}

                {config?.tooltip && label ? (
          <Tooltip 
            content={
              <CustomTooltip 
                units={config.tooltip.units}
                quarterDateFormat={config.tooltip.quarterDateFormat}
                manifest={config.tooltip.manifest}
              />
            }
          />
        ) : null}
      </PieChart>
    </ResponsiveContainer>
  ) : null;
};

SinglePercentDonutChart.propTypes = {
  config: PropTypes.object,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  mobile: PropTypes.bool
};

export default SinglePercentDonutChart;
