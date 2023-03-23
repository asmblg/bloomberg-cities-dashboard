import React from 'react';
import PropTypes from 'prop-types';
import { LineChart as LChart, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';

import { handleLabelFormatter } from '../utils';

const LineChart = ({ config, dataArray, color, height, width, margin }) => {
  return dataArray ? (
    <ResponsiveContainer height={height} width={width}>
      <LChart data={dataArray} margin={margin}>
        <XAxis
          dataKey={'name'}
          tickCount={config.xaxis?.tickCount || 2}
          interval={'preserveEnd'}
          tickFormatter={str => handleLabelFormatter(config.xaxis?.labelFormatter, str)}
        />
        <YAxis
          axisLine={false}
          tickCount={config.yaxis?.tickCount || 1}
          tickLine={false}
          tickFormatter={str => handleLabelFormatter(config.yaxis?.labelFormatter, str)}
          domain={config.yaxis?.domain ? config.yaxis.domain : [0, 'dataMax']}
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
