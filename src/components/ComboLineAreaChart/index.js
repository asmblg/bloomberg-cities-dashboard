import React, { useEffect, useState } from 'react';
import {
  // LineChart,
  XAxis,
  YAxis,
  // Line,
  Tooltip,
  Line,
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer
} from 'recharts';
import { handleData } from './utils';
import  formatValue  from '../../utils/formatValue';
import PropTypes from 'prop-types';

const ComboLineAreaChart = ({
  config,
  data,
  getter,
  // setter
}) => {

  const [lines, setLines] = useState([]);
  const [areas, setAreas] = useState([]);

  const {
    height,
    width,
    lineKey,
    areaKey,
    getterKey,
    colors,
    yaxis,
    indicator,
    basePath,
    totalFilter
  } = config;


  useEffect(() => {
    const lineData = handleData({
      data,
      totalFilter,
      basePathKey: basePath || getter?.[getterKey?.basePath],
      categoryKey: lineKey,
      indicatorKey: indicator?.var || getter?.[getterKey?.indicator]?.var,
      dataSelection: getter?.[getterKey?.lineSelector] || 'total'
    });

    setLines(lineData);


  }, [
    getter?.[getterKey?.basePath],
    getter?.[getterKey?.indicator],
    getter?.[getterKey?.lineSelector]
  ]);

  useEffect(() => {
    const areaData = handleData({
      data,
      basePathKey: basePath || getter?.[getterKey?.basePath],
      categoryKey: areaKey,
      indicatorKey: indicator?.var || getter?.[getterKey?.indicator]?.var,
      dataSelection: getter?.[getterKey?.areaSelector]
    });

    setAreas(areaData);
  }, [
    getter?.[getterKey?.basePath],
    getter?.[getterKey?.indicator],
    getter?.[getterKey?.areaSelector],
    getter?.[getterKey?.lineSelector]
  ]);

  console.log(lines);

  return (areas?.[0] || lines?.[0] ?
    <ResponsiveContainer
      height={height || '100%'}
      width={width || '100%'}
    >
      <ComposedChart
        data={areas[0] ? areas : lines}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid vertical={false} horizontal={true} opacity={0.5} />
        <YAxis
          // domain={calculateChartDomain(dataArray)}
          tickFormatter={text => formatValue(text, indicator?.units || getter?.[getterKey?.indicator]?.units)}
          label={{ 
            value: yaxis?.label === 'indicator' ? 
              indicator?.label || getter?.[getterKey?.indicator]?.label 
              : yaxis?.label, 
            angle: '-90',
            position: 'insideLeft', 
            dy: 50 
          }}
        />
        <XAxis dataKey="name" />
        {
          lines && getter?.[getterKey?.lineSelector] ?
            <Line
              type='monotone'
              key={`line-${getter?.[getterKey?.lineSelector]}-${getter?.[getterKey?.basePath]}`}
              dataKey={getter?.[getterKey?.lineSelector]}
              stroke={colors[1]}
            />
            : null
        }

        {
          areas && getter?.[getterKey?.areaSelector] ?
            getter?.[getterKey?.areaSelector]
              .map(({key, color}) =>
                <Area
                  type='monotone'
                  key={`area-${key}-${getter?.[getterKey?.basePath]}`}
                  dataKey={key}
                  stackId='1'
                  fill={color}
                  stroke={color}

                />
              )

            : null
        }
        <Tooltip />

      </ComposedChart>


    </ResponsiveContainer>
    : null
  );


};

ComboLineAreaChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  getter: PropTypes.object,
  setter: PropTypes.func
};

export default ComboLineAreaChart;