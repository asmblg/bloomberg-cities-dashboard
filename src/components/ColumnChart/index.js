import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
// import getRecentQuarterEndDates from '../../utils/getRecentQuarterEndDates';

import { handleData } from './utils';
import formatChartTick from '../../utils/formatChartTick';
import formatNumberWithCommas from '../../utils/formatNumberWithCommas';

const ColumnChart = ({ config, data, margin, height, width, hasTooltip }) => {
  const [dataArray, setDataArray] = useState(null);
  const { color, accentColor, yaxis, xaxis } = config;

  useEffect(() => {
    if (data) {
      const array = handleData(config, data);

      if (array) {
        const filteredData = array.filter(({ value }) => value || value === 0);
        setDataArray(filteredData);
      }
    }
  }, [data]);

  return dataArray ? (
    <ResponsiveContainer height={height || 200} width={width || 200}>
      <BarChart data={dataArray} barSize={10} barCategoryGap={0} margin={margin}>
        <XAxis
          dataKey={'name'}
          tickFormatter={text => formatChartTick(text, xaxis?.labelFormatter)}
        />
        <YAxis
          axisLine={false}
          tickFormatter={text => formatChartTick(text, yaxis?.labelFormatter)}
          tickCount={yaxis?.tickCount || 4}
          domain={yaxis?.domain || [0, 'dataMax']}
        />
        {hasTooltip ? (
          <Tooltip content={() => renderTooltip(dataArray, config.xaxis?.labelFormatter)} />
        ) : null}
        <Bar
          dataKey={'value'}
          stackId='a'
          fill={color || 'black'}
          stroke={accentColor || 'white'}
        />
      </BarChart>
    </ResponsiveContainer>
  ) : null;
};

ColumnChart.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  margin: PropTypes.object,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hasTooltip: PropTypes.bool
};

function renderTooltip(arr, keyFormatter) {
  return arr && arr[0] ? (
    <div className='chart-tooltip'>
      {arr.map((obj, i) => (
        <p key={`tooltip-item-${i}`}>{`${
          keyFormatter ? formatChartTick(obj.name, keyFormatter) : obj.name
        }: ${formatNumberWithCommas(obj.value)}`}</p>
      ))}
    </div>
  ) : null;
}

export default ColumnChart;
