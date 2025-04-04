import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { TailSpin } from 'react-loader-spinner';
import numeral from 'numeral';

import { handleData } from './utils';
import formatQuarterDate from '../../utils/formatQuarterDate';
import formatIndicatorLabel from '../../utils/formatIndicatorLabel';
import './style.css';

const HorizontalBarChart = ({ config, data, setter, getter }) => {
  const [dataArray, setDataArray] = useState(null);
  const valuesFormat = config.valuesFormat;
  const selectorPath = config?.getterKey?.selectorPath;
  const firstRowRef = useRef(null); 
  const hbcContainerRef = useRef(null);
  console.log(selectorPath, getter, data);

  useEffect(() => {
    // console.log(getter?.[selectorPath]);
    if (data) {
      // console.log(data);
      // if (selectorPath && getter?.[selectorPath]) {
      //   config.dataPath = `${config.dataPath}.${getter?.[selectorPath]?.key}`;
      // }
      // console.log(config.dataPath);
      if ((getter?.[selectorPath]) || !selectorPath) {
        const dataConfig = {...config};
        if (selectorPath && getter?.[selectorPath] ) {
          if (getter?.[selectorPath]?.dataPath) {
            dataConfig.dataPath = getter?.[selectorPath]?.dataPath;
          } else {
            dataConfig.dataPath = `${config.dataPath}.${getter?.[selectorPath]?.key}`;
          }
        } else {
          dataConfig.dataPath = config.dataPath;
        }

        if (getter?.[selectorPath]?.labels){
          dataConfig.labels = getter?.[selectorPath]?.labels;
        }
        // console.log(dataConfig);
        const { dataArr, currentAsOf } = handleData(data, dataConfig);
        // console.log(dataArr);
        if (dataArr) {
          setDataArray(dataArr);
          if (config?.setterKey?.currentAsOf && currentAsOf){
            setTimeout(() => setter(config?.setterKey?.currentAsOf, formatQuarterDate(currentAsOf, 'QX YYYY')), 0);
          }
          if (hbcContainerRef.current && firstRowRef.current) {
            const containerTop = hbcContainerRef.current.offsetTop;
            const firstRowTop = firstRowRef.current.offsetTop;
            const scrollPosition = firstRowTop - containerTop;
    
            hbcContainerRef.current.scrollTop = scrollPosition;
          }
        }      
      }

    }
  }, [
    data,
    getter?.[selectorPath],
    selectorPath
  ]);

  return dataArray ? (
    <>
      {config?.title
        ? config.titleSize === 'small'
          ? <h5 style={{margin: '0 0 10px 0'}}>{config.title}</h5>
          : <h4 className='hbc-title'>{config.title}</h4>
        : null
      }

      <div 
        className='hbc-container' 
        style={config?.chartWrapperStyle || {}}
        ref={hbcContainerRef}
      >
        {dataArray.map((item, index) => (
          <div 
            key={index} 
            className='hbc-row-container'
            ref={index === 0 ? firstRowRef : null}
          >
            <h5 className='hbc-row-label' style={config.layoutType === 'sorted-list'
              ? { justifyContent: 'flex-start', margin: '0 10px 0 0', padding: '5px 5px 5px 10px', backgroundColor: 'var(--primary-gray-color)' }
              : { justifyContent: 'flex-end', margin: '0 10px 0 5px' }
            }>
              {formatIndicatorLabel({
                formatter: config?.labelFormatter, 
                value: `${item?.name || ''}`.replace('.', '')
              })}
            </h5>
            <div className='hbc-bar-container'>
              <div
                className='hbc-bar'
                style={{
                  width: item.widthValue,
                  backgroundColor: config.primaryColor || 'var(--secondary-color)',
                  height: config.layoutType === 'sorted-list' ? '50%' : '100%',
                  margin: config.layoutType === 'sorted-list' ? 'auto 0' : '0'
                }}
              />
              <h5
                className='hbc-row-value'
                style={{
                  color: config.primaryColor || 'var(--secondary-color)',
                  marginRight: config.chartWrapperStyle?.overflowY ? '10px' : '0'
                }}
              >
                { 
                  valuesFormat 
                    ? numeral(Number(item.value)).format(valuesFormat)
                    : item.value
                }
              </h5>
            </div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <TailSpin
      color={'#006aaf'}
      width={100}
      height={100}
      wrapperStyle={{
        // width: '100vw',
        justifyContent: 'center',
        paddingTop: '20px'
      }}
    />
  );
};

HorizontalBarChart.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  setter: PropTypes.func,
  getter: PropTypes.object
};

export default HorizontalBarChart;
