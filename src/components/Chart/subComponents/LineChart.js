import React from 'react';
import PropTypes from 'prop-types';
import { LineChart as LChart, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';

const LineChart = ({ data, color, height, width, margin }) => {
  return data ? (
    <ResponsiveContainer height={height} width={width}>
      <LChart data={data} margin={margin}>
        <XAxis dataKey={'name'} tickCount={1} />
        <YAxis axisLine={false} tickCount={1} />
        <Line dataKey={'value'} dot={false} stroke={color || 'black'} strokeWidth={4} />
      </LChart>
    </ResponsiveContainer>
  ) : null; // Spinner/Loader?
};

LineChart.propTypes = {
  xaxis: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  margin: PropTypes.object,
  data: PropTypes.array,
  range: PropTypes.number
};

export default LineChart;
