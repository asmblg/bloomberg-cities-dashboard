import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { TailSpin } from 'react-loader-spinner';
import numeral from 'numeral';

import { handleData } from './utils';
import formatQuarterDate from '../../utils/formatQuarterDate';
import formatIndicatorLabel from '../../utils/formatIndicatorLabel';
import './style.css';
import { get } from 'mongoose';

const HorizontalBarChart = ({ config, data, setter, getter, manifest }) => {
  const [dataArray, setDataArray] = useState([]);
  const [dataConfig, setDataConfig] = useState({});
  const valuesFormat = config.valuesFormat;
  const selectorPath = config?.getterKey?.selectorPath;
  const selectedIndicator = config?.getterKey?.selectedIndicator;
  const firstRowRef = useRef(null); 
  const hbcContainerRef = useRef(null);

  // console.log(manifest)
  // console.log(selectorPath, getter, data);

  useEffect(() => {
    // console.log(getter?.[selectorPath]);
    if (data && (getter?.[selectorPath] || getter?.[selectedIndicator])) {

        const obj = {...config};
        const pathItem1 = getter?.[selectorPath]?.dataPath || 
        getter?.[selectorPath]?.value ||  
        getter?.[selectorPath]?.key ||
        getter?.[selectorPath];

        const pathItem2 = getter?.[selectedIndicator]?.dataPath ||
        getter?.[selectedIndicator]?.value ||
        getter?.[selectedIndicator]?.key ||
        getter?.[selectedIndicator];

        const manifestKey = getter?.[selectedIndicator]?.manifestKey || getter?.[selectorPath]?.manifestKey;

         
        const basePath = config?.dataPath ? `${config.dataPath}.` : '';

        // console.log({pathItem1, pathItem2, basePath})

        if (pathItem1) {
          obj.dataPath = `${pathItem1 || ''}`?.includes(basePath) ? pathItem1 : `${basePath}${pathItem1}`;
          if (pathItem2) {
            obj.dataPath = `${`${pathItem1 || ''}`?.includes(basePath) ? pathItem1 : `${basePath}${pathItem1}`}.${pathItem2}`;
          }
        } else if (pathItem2) {
          obj.dataPath = `${basePath}all.${pathItem2}`;
        } else {
          obj.dataPath = config?.defaultDataPath || config?.dataPath;
        }

        if (manifest) {
          obj.manifest = manifest?.[manifestKey] || {};
        }

        if (getter?.[selectorPath]) {
          obj.subHeader = getter?.[selectorPath]?.label
        }

        if (getter?.[selectedIndicator]) {
          obj.exclude = getter?.[selectedIndicator]?.exclude || [];
          obj.lowerLimit = getter?.[selectedIndicator]?.lowerLimit || null;
        }

        
        // console.log(config.dataPath, {config, obj});
        setDataConfig(obj);

    } else {
      setDataConfig(config);
    }
  }, [
    // data,
    getter?.[selectorPath],
    getter?.[selectedIndicator]
    // selectorPath
  ]);

  useEffect(() => {
    // console.log(getter?.[selectorPath]);
    if (data && dataConfig) {
        const { dataArr, currentAsOf } = handleData(data, dataConfig);
        if (dataArr) {
          setDataArray(dataArr);
          if (config?.setterKey?.currentAsOf && currentAsOf){
            setTimeout(() => setter(config?.setterKey?.currentAsOf, formatQuarterDate(currentAsOf, 'QX YYYY')), 0);
          }
          if (hbcContainerRef.current && firstRowRef.current) {
            const containerTop = hbcContainerRef.current.offsetTop;
            const firstRowTop = firstRowRef.current.offsetTop;
            const marginOffset = 10; // Add a small margin above the scrolled-to item
            const scrollPosition = firstRowTop - containerTop - marginOffset;
        
            hbcContainerRef.current.scrollTop = scrollPosition;
          }
        } else {
          setDataArray([]);
        }    
    } else {
      setDataArray([]);
    }  
  }, [
    dataConfig
  ]);


  // console.log('Manifest:', dataConfig?.manifest);
  return dataArray?.[0] ? (
    <>
      {config?.title
        ? config.titleSize === 'small'
          ? <h5 style={{margin: '0 0 10px 0'}}>{config?.title}</h5>
          : <h4 className='hbc-title'>{config?.title}</h4>
        : null
      }
      {!config?.noSubheading &&
        <h5 style={{margin: '10px'}}>{`${dataConfig?.subHeader || config?.defaultSubheading}`.toUpperCase()}</h5>
      }
      <div 
        className='hbc-container' 
        style={config?.chartWrapperStyle || {}}
        ref={hbcContainerRef}
      >

        {dataArray?.filter(
          item => Number(`${item?.value}`?.replace('%', '')) > 0
        )?.filter(item => !dataConfig?.exclude?.includes(item?.name)
        )?.filter(item => dataConfig?.lowerLimit
          ? item?.value > dataConfig?.lowerLimit 
          : true
        )?.map((item, index) => (
          <div 
            key={index} 
            className='hbc-row-container'
            ref={index === 0 ? firstRowRef : null}
          >
            <h5 className='hbc-row-label' style={{ 
                justifyContent: config.layoutType === 'sorted-list' ? 'flex-start' : 'flex-end', 
                margin: config.layoutType === 'sorted-list' ? '0 10px 0 0' : '0 10px 0 5px' ,
                padding: config.layoutType === 'sorted-list' ? '5px 5px 5px 10px' : null, 
                backgroundColor: config?.labelBackgroundColor || 'var(--primary-gray-color)'
              }
            }>
              {formatIndicatorLabel({
                manifest: dataConfig?.manifest || {},
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
                  valuesFormat && item?.value
                    ? numeral(Number(item?.value)).format(valuesFormat)
                    : item?.value
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
