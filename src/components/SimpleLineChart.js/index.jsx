import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import formatNumberWithCommas from '../../utils/formatNumberWithCommas';
import { LineChart as LChart, XAxis, YAxis, Line, ResponsiveContainer, Tooltip, Dot, LabelList } from 'recharts';

import CustomTooltip from '../CustomTooltip';

import formatChartTick from '../../utils/formatChartTick';
import handleSimpleChartDataArray from '../../utils/handleSimpleChartDataArray';

const SimpleLineChart = (props) => {
  console.log({props})
  const { config, data, height, width, margin, getter } = props;
  const [dataArray, setDataArray] = useState(null);
  // const [dataArray2, setDataArray2] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const indicator = selectedIndicator || config?.indicator;
  const yLabel = indicator?.yLabel || indicator?.label || config?.yaxis?.label || '';

  useEffect(() => {
    // console.log('getter', { config, getter });
    setSelectedIndicator(getter?.[config.getterKey?.selectedIndicator] || null);
  }, [getter?.[config.getterKey?.selectedIndicator]]);
  useEffect(() => {
    if (config?.primaryKey && config?.secondaryKey) {
      
      const dataPath1 = config?.primaryKey;
      const dataPath2 = config?.secondaryKey;
      const dataArr1 = handleSimpleChartDataArray(config, data, dataPath1);
      const dataArr2 = handleSimpleChartDataArray(config, data, dataPath2);
      console.log({dataArr1, dataArr2})

      if (dataArr1?.[0] && dataArr2?.[0]) {
        setDataArray(dataArr1.map((item, index) => {
          return {
            ...item,
            value2: dataArr2[index].value
          };
        }));
      }
      // if (dataArr2?.[0]) {
      //   setDataArray2(dataArr2);
      // }

    } else {
      const dataPath = indicator?.dataPath || config?.dataPath;
      const dataArr = handleSimpleChartDataArray(config, data, dataPath);
      if (dataArr?.[0]) {
        setDataArray(dataArr);
      }
    }
  }, [selectedIndicator, data]);

  const renderDot = (dotProps) => {
    // console.log('dotProps', dotProps);
    if (dotProps.index === dataArray.length - 1) {
      return (
        <Dot
          {...dotProps}
          fill={indicator?.strokeColor || config.color || '#8884d8'}
          r={3}
          strokeWidth={0}
        />
      );
    }
  }  

  const renderDot2 = (dotProps) => {
    // console.log('dotProps', dotProps);
    if (dotProps.index === dataArray.length - 1) {
      return (
        <Dot
          {...dotProps}
          fill={indicator?.strokeColor || config.secondaryColor || '#8884d8'}
          r={3}
          strokeWidth={0}
        />
      );
    }
  }  

  const  ValueLabel = (props) => {
    const {index, order, viewBox } = props;
    console.log('ValueLabel', props);
    const y = order === 'top' ? 10 : 35;
    const x = props.x + 10;
    
    return ( 
      index === dataArray.length - 1 &&
      <g>
      <text x={x} y={y} fill="#000" 
       fontSize={10} textAnchor="left">
        {props.name}
      </text> 
      <text x={x} y={y + 11} 
        fill="#000" 
        fontSize={10} 
        textAnchor="left"
        style={{ fontFamily: 'var(--font-family-bold)' }}
        
      >
        {formatNumberWithCommas(props.value)}
      </text>      
      </g>

    );
  };
  return dataArray ? (
    <ResponsiveContainer height={height || '100%'} width={width || '100%'}>
      <LChart data={dataArray} margin={margin || { top: 10, right: 20, bottom: 10, left: 10 }}>
        <XAxis
          dataKey={'name'}
          interval={'preserveStartEnd'}
          tick={{fontSize: 12}}
          tickFormatter={text => formatChartTick(text, config?.xaxis?.labelFormatter)}
        />
        {
          !config?.yaxis?.disabled 
          ? <YAxis
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
              domain={config?.domain || null}

            />
          : <YAxis 
              hide 
              domain={config?.domain || null}
            />
 
        }


        {config.tooltip ? (
          <Tooltip
            content={
              <CustomTooltip
                units={config.tooltip.units}
                quarterDateFormat={config.tooltip.quarterDateFormat}
                manifest={config?.tooltip?.manifest || {
                  value: indicator?.label || config?.yaxis?.label || 'Value'
                }}
              />
            }
          />
        ) : null}

        <Line
          type={'monotone'}
          dataKey={'value2'}
          dot={config.dot ? renderDot2 : false}
          stroke={indicator?.strokeColor || config.secondaryColor || '#8884d8'}
          strokeWidth={indicator?.strokeWidth || 1}
        >
         {config?.labelDot && 
          <LabelList 
            dataKey={'value2'} 
            position='right' 
            content={<ValueLabel/>}
            name={config?.secondaryKey}
            order='bottom'


          />}
         </Line>

        <Line
          type={'monotone'}
          dataKey={'value'}
          dot={config.dot ? renderDot : false}
          stroke={indicator?.strokeColor || config.color || '#8884d8'}
          strokeWidth={indicator?.strokeWidth || 3}
        > 
         {config?.labelDot && 
          <LabelList 
            dataKey={'value'} 
            position='right' 
            content={<ValueLabel/>}
            name={config?.primaryKey}
            order='top'
          />}
        </Line>


        
        
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
