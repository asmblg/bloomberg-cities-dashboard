import React, { useState, useEffect } from 'react';
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import CustomTooltip from '../CustomTooltip';
import PropTypes from 'prop-types';

// import CustomLabel from './subComponents/CustomLabel';
import IndicatorDropdown from '../IndicatorDropdown';

import { 
  handleDataArray,
  handleLineStyle, 
  handleDataObject, 
  // handleLabel 
} from './utils';
import formatValue from '../../utils/formatValue';
import calculateChartDomain from '../../utils/calculateChartDomain';

const MultiLineChart = ({ config, data, getter, setter }) => {
  const [dataArray, setDataArray] = useState(null);

  const {
    dataPath,
    getterKey,
    setterKey,
    indicators,
    fixedIndicator,
    dataLength,
    projectColor,
    compareColor,
    otherColor,
    yaxis,
    height,
    width,
    manifest
  } = config;

  const selectedIndicator = getter?.[getterKey?.selectedOption] || null;
  // Looks for a primary line from getter, then for a default primaryLine in the config
  const primaryLine = getterKey?.primaryLine
    ? getter?.[getterKey?.primaryLine]
    : config.primaryLine || null;
  const secondaryLine = getterKey?.secondaryLine
    ? getter?.[getterKey?.secondaryLine]
    : null;
  const dataObj = data
    ? handleDataObject({ data, dataPath, config, selectedIndicator, getter })
    : null;
  const allLinesArray = dataObj ? Object.keys(dataObj) : [];

  useEffect(() => {
    if (!selectedIndicator && indicators) {
      if (fixedIndicator) {
        const indicator = indicators.find(({ key }) => key === fixedIndicator);
        setter(setterKey?.selectedOption, indicator);
      } else {
        setter(setterKey?.selectedOption, indicators[0]);
      }
    }
  }, [getter, selectedIndicator]);

  useEffect(() => {
    if (
      data &&
      allLinesArray &&
      (primaryLine || secondaryLine)
    ) {
      handleDataArray({
        mainLineKey: primaryLine?.key || secondaryLine?.key || null,
        data: dataObj || {},
        selectedIndicator: selectedIndicator || null,
        allLinesArray: allLinesArray,
        dataLength
      }).then(array => {
        if (array) {
          setDataArray(array);
        }
      });
    }
  }, [data, getter]);

  return dataArray ? (
    <div className='chart-container'>
      {!config.disableDropdown ? (
        <IndicatorDropdown
          selectedOption={
            !selectedIndicator && fixedIndicator && config.label
              ? { key: config.label, label: config.label }
              : null
          }
          setter={setter}
          getter={getter}
          config={config}
          options={!fixedIndicator && indicators ? indicators : null}
        />
      ) : null}
      {dataArray[0] ? (
        <ResponsiveContainer
          height={height || '100%'}
          width={width || '100%'}
        >
          <LineChart
            data={dataArray}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid vertical={false} horizontal={true} opacity={0.5} />
            <XAxis
              type={'category'}
              dataKey='name'
              tickLine={false}
              interval={'preserveStartEnd'}
              tickFormatter={(key, i) => {
                if (i === 0 || i === dataArray.length - 1) {
                  return key;
                }
                return '';
              }}
            />
            <YAxis
              domain={calculateChartDomain(dataArray)}
              tickFormatter={text => formatValue(text, selectedIndicator?.units || yaxis?.units)}
              // label={yaxis?.label && !yaxis.labelFormatter ?
              //   {
              //     value: handleLabel(yaxis.label, selectedIndicator),
              //     angle: -90,
              //     position: 'center',
              //     offset: 0
              //   } : !yaxis?.label && yaxis?.labelFormatter ?
              //     <CustomLabel
              //       labelConfig={yaxis}
              //       selectedIndicator={selectedIndicator}
              //       getter={getter}
              //     /> : null
              // }
            />
            <Tooltip 
              content={
                <CustomTooltip 
                  filter={[
                    secondaryLine?.key,
                    primaryLine?.key
                  ]}
                  units={fixedIndicator?.units || selectedIndicator?.units}
                  manifest={manifest}
                />
              } 
            />
            {allLinesArray.map(city => {
              const { stroke, strokeWidth, zIndex } = handleLineStyle({
                lineKey: city,
                selectedLineKey: secondaryLine?.key,
                mainLineKey: primaryLine.key,
                projectColor,
                compareColor,
                otherColor
              });
              return (
                <Line
                  type='monotone'
                  key={`multi-line-city-${city}`}
                  dataKey={city}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  zIndex={zIndex}
                  isFront={true}
                  dot={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  ) : null;
};

MultiLineChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  getter: PropTypes.object,
  setter: PropTypes.func
};

export default MultiLineChart;
