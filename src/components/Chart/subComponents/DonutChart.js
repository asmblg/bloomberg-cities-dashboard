import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Label as PieLabel } from 'recharts';

const DonutChart = ({ label, color, height, width, dataArray }) => {
  return dataArray && dataArray[0] ? (
    <ResponsiveContainer height={height} width={width}>
      <PieChart title={`${label}: ${dataArray[0].value}`}>
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
  label: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataArray: PropTypes.array
};

export default DonutChart;
