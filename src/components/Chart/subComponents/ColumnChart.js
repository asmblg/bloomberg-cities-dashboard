import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const ColumnChart = ({ color, accentColor, height, width, margin, dataArray }) => {
  return dataArray && dataArray[0] ? (
    <ResponsiveContainer height={height} width={width}>
      <BarChart data={dataArray} barGap={0} barCategoryGap={0} margin={margin}>
        <XAxis dataKey={'name'} />
        <YAxis tickCount={1} axisLine={false} />
        <Bar
          dataKey={'value'}
          stackId='a'
          fill={color || 'black'}
          stroke={accentColor || 'white'}
        />
      </BarChart>
    </ResponsiveContainer>
  ) : null;
};

ColumnChart.propTypes = {
  xaxis: PropTypes.string,
  color: PropTypes.string,
  accentColor: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  margin: PropTypes.object,
  dataArray: PropTypes.array,
  range: PropTypes.number
};

export default ColumnChart;
