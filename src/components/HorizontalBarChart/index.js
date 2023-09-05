import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TailSpin } from 'react-loader-spinner';

import { handleData } from './utils';
import formatQuarterDate from '../../utils/formatQuarterDate';
import './style.css';

const HorizontalBarChart = ({ config, data, setter }) => {
  const [dataArray, setDataArray] = useState(null);

  useEffect(() => {
    if (data) {
      const { dataArr, currentAsOf } = handleData(data, config);

      if (dataArr) {
        if (config?.setterKey?.currentAsOf && currentAsOf){
          setter(config?.setterKey?.currentAsOf, formatQuarterDate(currentAsOf, 'QX YYYY'));
        }
        setDataArray(dataArr);
      }
    }
  }, [data]);

  return dataArray ? (
    <div className='hbc-container'>
      {config?.title
        ? config.titleSize === 'small'
          ? <h5 style={{margin: '0 0 10px 0'}}>{config.title}</h5>
          : <h4 className='hbc-title'>{config.title}</h4>
        : null
      }

      {dataArray.map((item, index) => (
        <div key={index} className='hbc-row-container'>
          <h5 className='hbc-row-label' style={config.layoutType === 'sorted-list'
            ? { justifyContent: 'flex-start', margin: '0 10px 0 0', padding: '5px 5px 5px 10px', backgroundColor: 'var(--primary-gray-color)' }
            : { justifyContent: 'flex-end', margin: '0 10px 0 5px' }
          }>
            {item.name}
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
              style={{ color: config.primaryColor || 'var(--secondary-color)' }}
            >
              {item.value}
            </h5>
          </div>
        </div>
      ))}
    </div>
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
  setter: PropTypes.func
};

export default HorizontalBarChart;
