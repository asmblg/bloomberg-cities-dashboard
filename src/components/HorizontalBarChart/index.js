import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TailSpin } from 'react-loader-spinner';

import { handleData } from './utils';
import './style.css';

const HorizontalBarChart = ({ config, data }) => {
  const [dataArray, setDataArray] = useState(null);

  useEffect(() => {
    const dataArr = handleData(data, config);

    if (dataArr) {
      setDataArray(dataArr);
    }
  }, []);

  return dataArray ? (
    <div className='hbc-container'>
      {config?.title ? <h4 className='hbc-title'>{config.title}</h4> : null}

      {dataArray.map((item, index) => (
        <div key={index} className='hbc-row-container'>
          <h5 className='hbc-row-label'>{item.name}</h5>
          <div className='hbc-bar-container'>
            <div
              className='hbc-bar'
              style={{
                width: item.widthValue,
                backgroundColor: config.primaryColor || 'var(--secondary-color)'
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
  data: PropTypes.object
};

export default HorizontalBarChart;
