import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Label as PieLabel, Tooltip } from 'recharts';

const SinglePercentDonutChart = ({ config, height, width, data }) => {
  const dataArray =
    data && data.key && data.value
      ? [
        { name: data.key, value: parseFloat(data.value), fillColor: config.color || '#333333' },
        {
          name: data.key,
          value: 100 - parseFloat(data.value),
          fillColor: config.accentColor || '#dfe5e9'
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
          outerRadius={config.radius.outer}
          innerRadius={config.radius.inner}
          startAngle={-270}
          endAngle={90}
        >
          {config.label ? (
            <PieLabel opacity={0.5} position={'center'} value={config.label} />
          ) : null}

          {dataArray.map(({ fillColor, value }, i) => (
            <Cell key={`donut-chart-cell-${value}-${i}`} fill={fillColor} />
          ))}
        </Pie>
        <Tooltip content={() => renderTooltip(dataArray[0])} />
      </PieChart>
    </ResponsiveContainer>
  ) : null;
};

SinglePercentDonutChart.propTypes = {
  config: PropTypes.object,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.object
};

function renderTooltip(data) {
  return data && data.name && data.value ? (
    <div className='chart-tooltip'>{`${data.name}: ${data.value}`}</div>
  ) : null;
}

export default SinglePercentDonutChart;
