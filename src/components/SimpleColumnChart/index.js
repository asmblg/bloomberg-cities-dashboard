import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { handleData } from './utils';
import calculateChartDomain from '../../utils/calculateChartDomain';
import formatChartTick from '../../utils/formatChartTick';
import formatNumberWithCommas from '../../utils/formatNumberWithCommas';

const SimpleColumnChart = ({ config, data, margin }) => {
  const [dataArray, setDataArray] = useState(null);
  const { color, accentColor, yaxis, xaxis, cartesianGrid, hasTooltip, height, width } = config;

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
    <ResponsiveContainer height={height || 300} width={width || '100%'}>
      <BarChart data={dataArray} barSize={10} barCategoryGap={0} margin={margin}>
        {cartesianGrid ? (
          <CartesianGrid
            vertical={cartesianGrid !== 'horizontal' || cartesianGrid === 'all'}
            horizontal={cartesianGrid === 'horizontal' || cartesianGrid === 'all'}
            opacity={0.5}
          />
        ) : null}
        <XAxis
          dataKey={'name'}
          tickFormatter={text => formatChartTick(text, xaxis?.labelFormatter)}
        />
        <YAxis
          axisLine={false}
          tickFormatter={text => formatChartTick(text, yaxis?.labelFormatter)}
          tickCount={yaxis?.tickCount || 4}
          domain={yaxis?.domain || calculateChartDomain(dataArray)}
          label={
            yaxis?.label
              ? {
                value: yaxis.label,
                angle: -90,
                position: 'insideLeft',
                dy: 50
              }
              : null
          }
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

SimpleColumnChart.propTypes = {
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

export default SimpleColumnChart;
