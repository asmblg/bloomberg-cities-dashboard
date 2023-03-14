import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, ResponsiveContainer, XAxis, LabelList, YAxis } from 'recharts';

const HorizontalBarChart = ({ color, height, width, dataArray, margin }) => {
  return (
    <ResponsiveContainer height={height} width={width}>
      <BarChart layout='vertical' data={dataArray} margin={margin}>
        <XAxis type='number' hide />
        <YAxis
          type='category'
          dataKey={'name'}
          tickCount={dataArray.length}
          axisLine={false}
          tickLine={false}
          padding={{ bottom: 20 }}
        />
        <Bar dataKey={'value'} fill={color} barSize={20}>
          <LabelList position={'right'} dataKey={'value'} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

HorizontalBarChart.propTypes = {
  color: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataArray: PropTypes.array,
  margin: PropTypes.object
};

export default HorizontalBarChart;
