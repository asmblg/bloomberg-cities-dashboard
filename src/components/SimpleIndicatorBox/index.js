import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import InfoIcon from '../InfoIcon';

import { handleDisplayObject } from './utils';
import formatValue from '../../utils/formatValue';
import './style.css';

const SimpleIndicatorBox = ({ data, config, getter }) => {
  const [displayObject, setDisplayObject] = useState({
    date: null,
    value: null
  });

  const { indicator, dataPath, getterKey } = config;
  const selectedCategory =
    getter && getterKey?.selectedCategory ? getter[getterKey.selectedCategory] : null;

  const selectedIndicator =
    !indicator && getterKey?.selectedIndicator
      ? getter[getterKey.selectedIndicator]
      : indicator || null;

  useEffect(() => {
    if (data) {
      const obj = handleDisplayObject({ data, selectedIndicator, selectedCategory, dataPath });

      if (obj.date && obj.value) {
        setDisplayObject({
          date: obj.date,
          value: obj.value
        });
      }
    }
  }, [selectedIndicator, data, selectedCategory]);

  return displayObject?.value && selectedIndicator ? (
    <div className='sib-container'>
      <div className='sib-label-container'>
        <div>
          <h4>{selectedCategory?.text?.toUpperCase() || ''}</h4>
          <h4>{selectedIndicator.label?.toUpperCase() || ''}</h4>
          {selectedIndicator.subLabel ? (
            <h5>{selectedIndicator.subLabel}</h5>
          ) : null}
        </div>
        <InfoIcon variableDescription={selectedIndicator.label} />
      </div>
      <h1 className='bold-font'>
        {formatValue(displayObject.value, selectedIndicator.units)}
      </h1>
    </div>
  ) : null;
};

SimpleIndicatorBox.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  getter: PropTypes.object
};

export default SimpleIndicatorBox;
