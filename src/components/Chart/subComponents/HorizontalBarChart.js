import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, ResponsiveContainer, XAxis, LabelList } from 'recharts';

const HorizontalBarChart = ({ color, height, width, dataArray }) => {
  // const data = dataArray ? dataArray : [{ name: label, value: '65' }];
  // console.log(dataArray.length, color, label);
  return (
    <ResponsiveContainer height={height} width={width}>
      <BarChart layout='vertical' data={dataArray}>
        <XAxis type='number' hide />
        <Bar dataKey={'value'} fill={color}>
          <LabelList position={'right'} dataKey='value' />
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
  dataArray: PropTypes.array
};

export default HorizontalBarChart;
