import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Label as PieLabel } from 'recharts';

const DonutChart = ({ label, height, width, radius, data }) => {
  return data ? (
    <ResponsiveContainer height={height} width={width}>
      <PieChart>
        <Pie
          data={data}
          dataKey={'value'}
          cx={'50%'}
          cy={'50%'}
          outerRadius={radius}
          innerRadius={radius / 2}
          startAngle={-270}
          endAngle={90}
        >
          {label ? <PieLabel opacity={0.5} position={'center'} value={label} /> : null}

          {data.map(({ fillColor, value }, i) => (
            <Cell key={`donut-chart-cell-${value}-${i}`} fill={fillColor} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  ) : null; // Spinner Here?
};

DonutChart.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.array,
  radius: PropTypes.number
};

export default DonutChart;
