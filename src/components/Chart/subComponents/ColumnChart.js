import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const ColumnChart = ({ config }) => {
  const { xaxis, color } = config; // accentColor available in config
  const dataArray = [];

  return (
    <ResponsiveContainer height={100} width={'100%'}>
      <BarChart
        data={dataArray}
        barGap={0}
        barCategoryGap={0}
        margin={{ top: 20, right: 30, left: -25, bottom: 0 }}
      >
        <XAxis dataKey={xaxis} />
        <YAxis tickCount={1} />
        <Bar dataKey={'value'} stackId='a' fill={color || 'black'} />
        {/* <Bar dataKey={'colDifference'} stackId='a' fill={accentColor} /> // One option to add accent to top of bar */}
      </BarChart>
    </ResponsiveContainer>
  );
};

ColumnChart.propTypes = {
  config: PropTypes.object
};

export default ColumnChart;
