import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const ColumnChart = ({ config }) => {
  const { xaxis, color, accentColor } = config;
  const testData = [
    {
      [xaxis]: 'Q1-22',
      value: 200
    },
    {
      [xaxis]: 'Q2-22',
      value: 225
    },
    {
      [xaxis]: 'Q3-22',
      value: 300
    },
    {
      [xaxis]: 'Q4-22',
      value: 275
    }
  ];

  return (
    <ResponsiveContainer height={100} width={'100%'}>
      <BarChart
        data={testData}
        barGap={0}
        barCategoryGap={0}
        margin={{ top: 30, right: 0, bottom: -10, left: -29 }}
      >
        <XAxis dataKey={xaxis} />
        <YAxis tickCount={1} axisLine={false} />
        <Bar
          dataKey={'value'}
          stackId='a'
          fill={color || 'black'}
          stroke={accentColor || 'white'}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

ColumnChart.propTypes = {
  config: PropTypes.object
};

export default ColumnChart;
