import React, { useState, useEffect } from 'react';
import { 
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import PropTypes from 'prop-types';

import IndicatorDropdown from '../IndicatorDropdown';

import { handleDataArray, handleDefaultIndicator } from './utils';
import calculateChartDomain from '../../utils/calculateChartDomain';

const CompareColumnChart = ({ config, data, getter, setter }) => {
  const [dataArray, setDataArray] = useState([]);
  const {
    fixedIndicator,
    dataLength,
    mainColor,
    compareColor,
    indicators,
    width,
    height
  } = config;
  const setterKey = config.setterKey.selectedOption;
  const selectedIndicator = getter[config.getterKey?.selectedOption] || null;
  const primaryColumn = config.primaryColumn || getter[config.getterKey?.primaryColumn];
  const secondaryColumn = getter[config.getterKey?.secondaryColumn] || null;
  const allColumnsArray = [primaryColumn, secondaryColumn || {}];

  useEffect(() => {
    if (data && data[primaryColumn.key] && selectedIndicator && allColumnsArray) {
      handleDataArray({
        primaryColumnKey: primaryColumn.key,
        data,
        selectedIndicator,
        allColumnsArray,
        dataLength
      }).then(array => {
        if (array) {
          setDataArray(array);
        }
      });
    }
  }, [selectedIndicator, primaryColumn, secondaryColumn, data, getter]);

  useEffect(() => {
    if (setterKey) {
      handleDefaultIndicator({ fixedIndicator, indicators })
        .then(indicator => {
          if (indicator) {
            setter(setterKey, indicator);
          }
        });
    }
  }, []);

  return selectedIndicator && dataArray ? (
    <div className='chart-container'>
      {/* ---------- Dropdown ---------- */}
      {
        !config.disableDropdown ? 
          <IndicatorDropdown
            setter={setter}
            getter={getter}
            config={config}
            options={!fixedIndicator ? indicators : null}
          />
          : null
      }
      {/* ---------- CHART ---------- */}
      <ResponsiveContainer
        height={height || '100%'}
        width={width || '100%'}
      >
        <BarChart
          data={dataArray}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid vertical={false} horizontal={true} opacity={0.5} />
          <XAxis
            type={'category'}
            dataKey='name'
            tickCount={2}
            barSize={10}
            tickLine={{ stroke: 'transparent' }}
            axisLine={{ stroke: 'black', strokeDasharray: '1 0' }}
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
            type={'number'}
            label={{ value: config.yaxis.label, angle: '-90', position: 'insideLeft', dy: 50 }}
          />
          <Tooltip />

          {!fixedIndicator && allColumnsArray
            ? allColumnsArray.map(({ key }, i) => (
              <Bar
                key={`${key}-line-${i}`}
                dataKey={key}
                fill={key === primaryColumn.key ? mainColor : compareColor}
                isFront={true}
              />
            ))
            : null}
        </BarChart>
      </ResponsiveContainer>
    </div>
  ) : null;
};

CompareColumnChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  getter: PropTypes.object,
  setter: PropTypes.func
};

export default CompareColumnChart;
