import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Label as PieLabel } from 'recharts';

const DonutChart = ({ config, value }) => {
  const { label, color } = config;
  const dataArray = [];

  return value ? (
    <ResponsiveContainer height={100} width={'100%'}>
      <PieChart title={`${label}: ${value}`}>
        <Pie
          data={dataArray}
          dataKey={'value'}
          cx={'50%'}
          cy={'50%'}
          outerRadius={40}
          innerRadius={25}
          startAngle={-270}
          endAngle={90}
          fill={color || 'black'}
        >
          <PieLabel opacity={0.5} position={'center'} value={label} />
          {dataArray.map(({ fillColor, value }, i) => (
            <Cell key={`donut-chart-cell-${value}-${i}`} fill={fillColor} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  ) : null; // Spinner Here?
};

DonutChart.propTypes = {
  config: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default DonutChart;
