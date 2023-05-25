import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LineChart as LChart, XAxis, YAxis, Line, ResponsiveContainer, Tooltip } from 'recharts';

import CustomTooltip from '../CustomTooltip';

import formatChartTick from '../../utils/formatChartTick';
import handleSimpleChartDataArray from '../../utils/handleSimpleChartDataArray';

const SimpleLineChart = ({ config, data, height, width, margin }) => {
  const [dataArray, setDataArray] = useState(null);

  useEffect(() => {
    const dataArr = handleSimpleChartDataArray(config, data);

    if (dataArr?.[0]) {
      setDataArray(dataArr);
    }
  }, []);

  return dataArray ? (
    <ResponsiveContainer height={height || '100%'} width={width || '100%'}>
      <LChart data={dataArray} margin={margin}>
        <XAxis
          dataKey={'name'}
          interval={'preserveStartEnd'}
          tickFormatter={text => formatChartTick(text, config?.xaxis?.labelFormatter)}
        />
        <YAxis
          axisLine={false}
          tickCount={config.yaxis?.tickCount || 1}
          tickFormatter={text => formatChartTick(text, config?.yaxis?.labelFormatter)}
        />

        {config.tooltip ? (
          <Tooltip
            content={
              <CustomTooltip
                units={config.tooltip.units}
                quarterDateFormat={config.tooltip.quarterDateFormat}
                manifest={config.tooltip.manifest}
              />
            }
          />
        ) : null}

        <Line
          type={'monotone'}
          dataKey={'value'}
          dot={false}
          stroke={config.color}
          strokeWidth={3}
        />
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
  data: PropTypes.object,
  range: PropTypes.number,
  domain: PropTypes.array
};

export default SimpleLineChart;
