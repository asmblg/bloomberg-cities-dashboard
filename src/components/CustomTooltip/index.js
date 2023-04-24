import React from 'react';
import formatValue from '../../utils/formatValue';

import PropTypes from 'prop-types';


const CustomTooltip = ({ active, payload, label }, manifest) => {
  console.log({ active, payload, label });
  
  if (active && payload?.[0]) {
    return (
      <div className='custom-tooltip'>
        <h4 className='custom-tooltip-label'>
          {label}
        </h4> 
        {
          payload.map(({name, value, color}, i) =>
            <p
              style={{color: color }} 
              key={`custom-tooltip-${label.replace(/ /g, '-')}-${name}-${i}`}>
              {manifest?.[name] || name.toUpperCase()}: {formatValue(value)}
            </p>
          )
        }
          
        {/* ${formatValue(payload[0].value)}`} */}
        {/* <p className='intro'></p>
        <p className='desc'>Anything you want can be displayed here.</p> */}
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
  manifest: PropTypes.object
};


export default CustomTooltip;