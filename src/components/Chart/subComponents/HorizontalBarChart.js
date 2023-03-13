import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, ResponsiveContainer, XAxis, LabelList, YAxis } from 'recharts';

const HorizontalBarChart = ({ color, height, width, dataArray, margin }) => {
  // const data = dataArray ? dataArray : [{ name: label, value: '65' }];
  // console.log(dataArray.length, color, label);
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
          // minTickGap={20}
          padding={{ bottom: 20 }}
        />
        {/* <Label position={'left'} value={'test'} /> */}
        <Bar dataKey={'value'} fill={color} barSize={20}>
          <LabelList position={'right'} dataKey={'value'} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

HorizontalBarChart.propTypes = {
  // label: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataArray: PropTypes.array,
  margin: PropTypes.object
};

export default HorizontalBarChart;
