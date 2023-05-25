import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid, 
  ReferenceLine
} from 'recharts';

import CustomTooltip from '../CustomTooltip';

import handleSimpleChartDataArray from '../../utils/handleSimpleChartDataArray';
import formatChartTick from '../../utils/formatChartTick';

const SimpleColumnChart = ({ config, data, margin }) => {
  const [dataArray, setDataArray] = useState(null);
  const { 
    color,
    accentColor,
    yaxis,
    xaxis,
    cartesianGrid,
    tooltip,
    height,
    width,
    domain
  } = config;

  useEffect(() => {
    if (data) {
      const array = handleSimpleChartDataArray(config, data);
      // console.log(array);

      if (array) {
        const filteredData = array.filter(({ value }) => value || value === 0);
        setDataArray(filteredData);
      }
    }
  }, [data]);

  return dataArray ? (
    <ResponsiveContainer height={height || '100%'} width={width || '100%'}>
      <BarChart data={dataArray} barSize={30} barCategoryGap={0} margin={margin}>
        {cartesianGrid ? (
          <CartesianGrid
            vertical={cartesianGrid !== 'horizontal' || cartesianGrid === 'all'}
            horizontal={cartesianGrid === 'horizontal' || cartesianGrid === 'all'}
            opacity={0.5}
          />
        ) : null}
        <ReferenceLine y={0} stroke="#000000" />

        <XAxis
          dataKey={'name'}
          axisLine={false}
          tickFormatter={text => formatChartTick(text, xaxis?.labelFormatter)}
        />
        <YAxis
          axisLine={false}
          tickFormatter={text => formatChartTick(text, yaxis?.labelFormatter)}
          tickCount={yaxis?.tickCount || 4}
          domain={domain}
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
        {tooltip ? (
          <Tooltip 
            content={
              <CustomTooltip 
                units={tooltip.units}
                quarterDateFormat={tooltip.quarterDateFormat}
                manifest={tooltip.manifest}
              />
            }
          />
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
  tooltip: PropTypes.object
};

// function renderTooltip(arr, keyFormatter) {
//   return arr && arr[0] ? (
//     <div className='chart-tooltip'>
//       {arr.map((obj, i) => (
//         <p key={`tooltip-item-${i}`}>{`${
//           keyFormatter ? formatChartTick(obj.name, keyFormatter) : obj.name
//         }: ${formatNumberWithCommas(obj.value)}`}</p>
//       ))}
//     </div>
//   ) : null;
// }

export default SimpleColumnChart;
