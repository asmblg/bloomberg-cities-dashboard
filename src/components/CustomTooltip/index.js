import React from 'react';
import formatValue from '../../utils/formatValue';
import formatQuarterDate from '../../utils/formatQuarterDate';
// import dateToQuarter from '../../utils/dateToQuarter';

import PropTypes from 'prop-types';
import './style.css';


const CustomTooltip = ({ 
  active, 
  payload, 
  label,
  filter,
  manifest,
  units,
  quarterDateFormat
}) => {
  // console.log(manifest);
  // console.log({ active, payload, label, filter, manifest, units });
  
  if (active && payload?.[0]) {
    return (
      <div className='custom-tooltip'>
        <h4 className='custom-tooltip-header'>
          {quarterDateFormat ? formatQuarterDate(label, quarterDateFormat): label}
        </h4> 
        {
          payload
            .filter(({name}) => filter?.length > 0 ? filter.includes(name) : true)
            .reverse()
            .map(({name, value, color}, i) =>
              <p
                style={{color: color }} 
                key={`custom-tooltip-${label.replace(/ /g, '-')}-${name}-${i}`}>
                {manifest?.[name] || name.toUpperCase()}: {formatValue(value, units)}
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
  manifest: PropTypes.object,
  filter: PropTypes.array,
  units: PropTypes.string,
  quarterDateFormat: PropTypes.string
};


export default CustomTooltip;