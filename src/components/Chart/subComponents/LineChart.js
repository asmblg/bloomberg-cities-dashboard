import React from 'react';
import PropTypes from 'prop-types';
import { LineChart as LChart, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';

const LineChart = ({ config }) => {
  const { xaxis, color } = config;
  const dataArray = [
    // {
    //   [xaxis]: 'Q1-22',
    //   value: 125
    // },
    // {
    //   [xaxis]: 'Q2-22',
    //   value: 275
    // },
    // {
    //   [xaxis]: 'Q3-22',
    //   value: 200
    // },
    // {
    //   [xaxis]: 'Q4-22',
    //   value: 300
    // }
  ];
  return dataArray && dataArray[0] ? (
    <ResponsiveContainer height={100} width={'100%'}>
      <LChart data={dataArray} margin={{ top: 30, right: 0, bottom: -10, left: -29 }}>
        <XAxis dataKey={xaxis} tickCount={1} />
        <YAxis axisLine={false} tickCount={1} />
        <Line dataKey={'value'} dot={false} stroke={color || 'black'} strokeWidth={4} />
      </LChart>
    </ResponsiveContainer>
  ) : null; // Spinner/Loader?
};

LineChart.propTypes = {
  config: PropTypes.object
};

export default LineChart;
