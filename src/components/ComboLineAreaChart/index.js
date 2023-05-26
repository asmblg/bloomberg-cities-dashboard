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
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import CustomTooltip from '../CustomTooltip';
import { handleData } from './utils';
import formatValue from '../../utils/formatValue';
import dateToQuarter from '../../utils/dateToQuarter';
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
    totalFilter,
    average,
    linesInsteadOfArea,
    quarterDateFormat,
    domain
  } = config;


  useEffect(() => {
    const lineData = handleData({
      data,
      totalFilter,
      basePathKey: basePath || getter?.[getterKey?.basePath],
      categoryKey: lineKey,
      indicatorKey: indicator?.var || getter?.[getterKey?.indicator]?.var,
      dataSelection: getter?.[getterKey?.lineSelector] || 'total',
      average,
      calculator : indicator?.calculator || getter?.[getterKey?.indicator]?.calculator ,
      trendValue: getter?.[getterKey?.trendValue] || 'QtQ'
    });

    setLines(lineData);


  }, [
    getter?.[getterKey?.basePath],
    getter?.[getterKey?.indicator],
    getter?.[getterKey?.lineSelector],
    getter?.[getterKey?.trendValue],
    data
  ]);

  useEffect(() => {
    const areaData = handleData({
      data,
      basePathKey: basePath || getter?.[getterKey?.basePath],
      categoryKey: areaKey,
      indicatorKey: indicator?.var || getter?.[getterKey?.indicator]?.var,
      dataSelection: getter?.[getterKey?.areaSelector],
      average,
      calculator : indicator?.calculator || getter?.[getterKey?.indicator]?.calculator ,
      trendValue: getter?.[getterKey?.trendValue] || 'QtQ'
    });

    setAreas(areaData);
  }, [
    getter?.[getterKey?.basePath],
    getter?.[getterKey?.indicator],
    getter?.[getterKey?.areaSelector],
    getter?.[getterKey?.lineSelector],
    getter?.[getterKey?.trendValue],
    data
  ]);

  // console.log(lines);

  return (areas?.[0] || lines?.[0] ?
    <div className='chart-container'>
      <ResponsiveContainer
        height={height || '100%'}
        width={width || '100%'}
      >
        <ComposedChart
          data={areas[0] ? areas : lines}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid vertical={false} horizontal={true} opacity={0.5} />
          <ReferenceLine y={0} stroke='#000000' />
          <YAxis
            domain={domain}
            tickFormatter={text => formatValue(
              text, 
              indicator?.units || getter?.[getterKey?.indicator]?.units,
              true //onAxis?
            )}
            label={{
              value: yaxis?.label === 'indicator' ?
                indicator?.label || getter?.[getterKey?.indicator]?.label
                : yaxis?.label || 'Percent Change',
              angle: '-90',
              position: 'insideLeft',
              dy: 50
            }}
          />
          <XAxis 
            tickFormatter={text => dateToQuarter(text) }
            dataKey="name" 
            axisLine={false}
          />
          {
            lines && getter?.[getterKey?.lineSelector] ?
              <Line
                type='monotone'
                key={`line-${getter?.[getterKey?.lineSelector]}-${getter?.[getterKey?.basePath]}`}
                dataKey={getter?.[getterKey?.lineSelector]}
                stroke={colors[0]}
                dot={false}
                strokeWidth={3}
              />
              : null
          }

          {
            areas && getter?.[getterKey?.areaSelector] ?
              getter?.[getterKey?.areaSelector]
                .map(({ key, color }) =>
                  linesInsteadOfArea ?
                    <Line
                      type='monotone'
                      key={`line-${key}-${getter?.[getterKey?.basePath]}`}
                      dataKey={key}
                      // stackId='1'
                      // fill={color}
                      strokeWidth={3}
                      dot={false}
                      stroke={color}

                    />
                    : <Area
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
          <Tooltip 
            content={
              <CustomTooltip
                units={indicator?.units || getter?.[getterKey?.indicator]?.units}
                quarterDateFormat={quarterDateFormat}

              />
            } 
          />

        </ComposedChart>


      </ResponsiveContainer>
    </div>

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