import React from 'react';
import PropTypes from 'prop-types';
import { LineChart as LChart, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
// import moment from 'moment';

import { handleLabelFormatter } from '../utils';

const LineChart = ({ config, dataArray, color, height, width, margin }) => {
  return dataArray ? (
    <ResponsiveContainer height={height} width={width}>
      <LChart data={dataArray} margin={margin}>
        <XAxis
          dataKey={'name'}
          tickCount={config.xaxis.tickCount}
          tickFormatter={str => handleLabelFormatter(config.xaxis?.labelFormatter, str)}
        />
        <YAxis
          axisLine={false}
          tickCount={2}
          tickLine={false}
          tickFormatter={str => handleLabelFormatter(config.yaxis?.labelFormatter, str)}
          domain={['dataMin', 'dataMax']}
        />
        <Line dataKey={'value'} dot={false} stroke={color || 'black'} strokeWidth={4} />
      </LChart>
    </ResponsiveContainer>
  ) : null;
};

LineChart.propTypes = {
  config: PropTypes.object,
  xaxis: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  margin: PropTypes.object,
  dataArray: PropTypes.array,
  range: PropTypes.number
};

export default LineChart;
