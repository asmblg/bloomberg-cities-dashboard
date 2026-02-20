import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

import CustomTooltip from '../CustomTooltip';

import './style.css';

const SinglePercentDonutChart = ({ 
  config, 
  height,
  innerRadius, 
  outerRadius,
  startAngle,
  outline,
  width, 
  value, 
  values,
  label, 
  mobile,
  comparisonColors 
}) => {
  console.log('comparisonColors', comparisonColors);
  const multiplier = config?.values?.multiplier || 1;

  const denominator = config?.values?.calculator === 'percentFromCounts' && values
    ? Object.values(values).reduce((acc, val) => acc + parseFloat(val), 0)
    : 100;
  
  const dataArray = values 
  ? Object.entries(values).map(([key, val], i) => ({
      name: key,
      value: parseFloat((val / denominator) * 100 * multiplier),
      fillColor: comparisonColors?.[key] || '#333333'
    }))
  : value
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
        <Pie
          data={dataArray}
          dataKey={'value'}
          cx={mobile ? '65%' : '50%'}
          cy={'50%'}
          outerRadius={mobile ? '100%' : outerRadius || '80%'}
          innerRadius={mobile ? '50%' : innerRadius || '40%'}
          startAngle={450}
          endAngle={90}
        > 

          {dataArray.map(({ fillColor, value }, i) => (
            <Cell 
              key={`donut-chart-cell-${value}-${i}`} 
              fill={fillColor} 
              // stroke='black'
              // strokeWidth={0.5}
              stroke={outline || '#FFFFFF'}
              strokeWidth={1}
            />
          ))}
        </Pie>

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
