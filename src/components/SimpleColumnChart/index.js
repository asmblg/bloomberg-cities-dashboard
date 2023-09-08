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
import { getStackedKeys } from './utils';

const SimpleColumnChart = ({ config, data, margin, getter }) => {
  const [dataPath, setDataPath] = useState(config?.dataPath || null);
  const [dataArray, setDataArray] = useState(null);
  const [chartConfig, setChartConfig] = useState({
    xaxis: config?.xaxis,
    yaxis: config?.yaxis,
    tooltip: config?.tooltip
  });

  const {
    color,
    accentColor,
    cartesianGrid,
    height,
    width,
    getterKey
  } = config;
  
  useEffect(() => {
    const selectedIndicator = getter?.[getterKey?.selectedIndicator] || null;

    if (selectedIndicator) {
      if (selectedIndicator.key) {
        setDataPath(selectedIndicator.key);
      }

      if (selectedIndicator.chartConfig) {
        setChartConfig(selectedIndicator.chartConfig);
      }
    }
  }, [getter]);

  useEffect(() => {
    if (data) {
      console.log(data, dataPath);
      const array = handleSimpleChartDataArray(config, data, dataPath);
      console.log(array);

      if (array) {
        const filteredData = !config.stacked ? array.filter(({ value }) => value || value === 0) : array;
        setDataArray(filteredData);
      }
    }
  }, [data, dataPath]);

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
          tickFormatter={text => formatChartTick(text, chartConfig?.xaxis?.labelFormatter)}
        />
        <YAxis
          axisLine={false}
          tickFormatter={text => formatChartTick(text, chartConfig?.yaxis?.labelFormatter, chartConfig?.yaxis?.units)}
          tickCount={chartConfig?.yaxis?.tickCount || 4}
          domain={chartConfig?.yaxis?.domain}
          label={
            chartConfig?.yaxis?.label
              ? {
                value: chartConfig?.yaxis.label,
                angle: -90,
                position: 'insideLeft',
                dy: 50
              }
              : null
          }
        />
        {chartConfig?.tooltip ? (
          <Tooltip 
            content={
              <CustomTooltip 
                units={chartConfig?.tooltip.units}
                quarterDateFormat={chartConfig?.tooltip.quarterDateFormat}
                manifest={chartConfig?.tooltip.manifest}
              />
            }
          />
        ) : null}
        {!config.stacked ? (
          <Bar
            dataKey={'value'}
            stackId='a'
            fill={color || 'black'}
            stroke={accentColor || 'white'}
          />
        ) : 
          getStackedKeys(dataArray).map(key => (
            <Bar
              key={`bar-${key}`}
              dataKey={key}
              stackId='a'
              fill={color || 'black'}
              stroke={accentColor || 'white'}
            />
          ))}
        
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
  tooltip: PropTypes.object,
  getter: PropTypes.object
};

export default SimpleColumnChart;
