import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LineChart as LChart, XAxis, YAxis, Line, ResponsiveContainer, Tooltip } from 'recharts';

import CustomTooltip from '../CustomTooltip';

import formatChartTick from '../../utils/formatChartTick';
import handleSimpleChartDataArray from '../../utils/handleSimpleChartDataArray';

const SimpleLineChart = (props) => {
  const { config, data, height, width, margin, getter } = props;
  const [dataArray, setDataArray] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const indicator = selectedIndicator || config?.indicator;
  const yLabel = indicator?.yLabel || indicator?.label ||config?.yaxis?.label || '';

  useEffect(() => {
    console.log('getter', {config, getter});
    setSelectedIndicator(getter?.[config.getterKey?.selectedIndicator] || null);
  }, [getter?.[config.getterKey?.selectedIndicator]]);
  useEffect(() => {
    const dataPath = indicator?.dataPath || config?.dataPath;
    const dataArr = handleSimpleChartDataArray(config, data, dataPath);
    if (dataArr?.[0]) {
      setDataArray(dataArr);
    }
  }, [selectedIndicator, data]);
  return dataArray ? (
    <ResponsiveContainer height={height || '100%'} width={width || '100%'}>
      <LChart data={dataArray} margin={margin || { top: 10, right: 10, bottom: 10, left: 10 }}>
        <XAxis
          dataKey={'name'}
          interval={'preserveStartEnd'}
          tickFormatter={text => formatChartTick(text, config?.xaxis?.labelFormatter)}
        />
        <YAxis
          axisLine={false}
          tickCount={config.yaxis?.tickCount || 4}
          tickFormatter={text => formatChartTick(text, config?.yaxis?.labelFormatter)}
          label={{
            value: yLabel,
            angle: '-90',
            position: 'insideLeft',
            fontSize: 18,
            dy: 10
          }}
          
        />

        {config.tooltip ? (
          <Tooltip
            content={
              <CustomTooltip
                units={config.tooltip.units}
                quarterDateFormat={config.tooltip.quarterDateFormat}
                manifest={config?.tooltip?.manifest || {
                  value : indicator?.label || config?.yaxis?.label || 'Value'
                }}
              />
            }
          />
        ) : null}

        <Line
          type={'monotone'}
          dataKey={'value'}
          dot={false}
          stroke={indicator?.strokeColor || config.color || '#8884d8'}
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
  domain: PropTypes.array,
  getter: PropTypes.object
};

export default SimpleLineChart;
