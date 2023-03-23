import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Label as PieLabel } from 'recharts';

const DonutChart = ({ config, height, width, dataArray }) => {
  return dataArray && dataArray[0] ? (
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
          {config.label ? <PieLabel opacity={0.5} position={'center'} value={config.label} /> : null}

          {dataArray.map(({ fillColor, value }, i) => (
            <Cell key={`donut-chart-cell-${value}-${i}`} fill={fillColor} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  ) : null;
};

DonutChart.propTypes = {
  config: PropTypes.object,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataArray: PropTypes.array
};

export default DonutChart;
