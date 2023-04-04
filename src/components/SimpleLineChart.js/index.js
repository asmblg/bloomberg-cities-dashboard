import React from 'react';
import PropTypes from 'prop-types';
import { LineChart as LChart, XAxis, YAxis, Line, ResponsiveContainer, Tooltip } from 'recharts';

import { handleLabelFormatter } from './utils';

// Needs to be reworked when we have Tourism Spending data and Venture Capital Investment
const SimpleLineChart = ({ config, dataArray, color, height, width, margin }) => {
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
        <Tooltip content={() => renderTooltip(dataArray, config.xaxis?.labelFormatter)} />
        <Line dataKey={'value'} dot={false} stroke={color || 'black'} strokeWidth={4} />
      </LChart>
    </ResponsiveContainer>
  ) : null;
};

SimpleLineChart.propTypes = {
  config: PropTypes.object,
  xaxis: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  margin: PropTypes.object,
  dataArray: PropTypes.array,
  range: PropTypes.number
};

function renderTooltip(arr, keyFormatter) {
  return arr && arr[0] ? (
    <div className='summary-chart-tooltip'>
      {arr.map((obj, i) => (
        <p key={`tooltip-item-${i}`}>{`${
          keyFormatter ? handleLabelFormatter(keyFormatter, obj.name) : obj.name
        }: ${obj.value}`}</p>
      ))}
    </div>
  ) : null;
}

export default SimpleLineChart;
