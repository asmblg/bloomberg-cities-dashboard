import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Label as PieLabel } from 'recharts';

const SinglePercentDonutChart = ({ config, height, width, value }) => {
  const dataArray = value
    ? [
      {
        name: 'percentage',
        value: parseFloat(value),
        fillColor: config?.color || '#333333'
      },
      {
        name: 'percentage',
        value: 100 - parseFloat(value),
        fillColor: config?.accentColor || '#dfe5e9'
      }
    ]
    : [];

  return dataArray ? (
    <ResponsiveContainer height={height} width={width}>
      <PieChart>
        <Pie
          data={dataArray}
          dataKey={'value'}
          cx={'50%'}
          cy={'50%'}
          outerRadius={config?.radius?.outer || 60}
          innerRadius={config?.radius?.inner || 30}
          startAngle={-270}
          endAngle={90}
        >
          {config?.label ? (
            <PieLabel opacity={0.5} position={'center'} value={config.label} />
          ) : null}

          {dataArray.map(({ fillColor, value }, i) => (
            <Cell key={`donut-chart-cell-${value}-${i}`} fill={fillColor} />
          ))}
        </Pie>
        {/* <Tooltip content={() => renderTooltip(dataArray[0])} /> */}
      </PieChart>
    </ResponsiveContainer>
  ) : null;
};

SinglePercentDonutChart.propTypes = {
  config: PropTypes.object,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

// function renderTooltip(data) {
//   return data && data.name && data.value ? (
//     <div className='chart-tooltip'>{`${data.name}: ${data.value}`}</div>
//   ) : null;
// }

export default SinglePercentDonutChart;
