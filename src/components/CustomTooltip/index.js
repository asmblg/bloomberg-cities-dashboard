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
  // console.log(label);
  // console.log({ active, payload, label, filter, manifest, units, quarterDateFormat });
  
  if (active && payload?.[0]) {
    return (
      <div className='custom-tooltip'>
        <h4 className='custom-tooltip-header'>
          {quarterDateFormat ? formatQuarterDate(label || payload?.[0]?.name, quarterDateFormat): label}
        </h4> 
        {
          payload
            .filter(({name}) => filter?.length > 0 ? filter.includes(name) : true)
            .reverse()
            .map(({name, value, color, dataKey}, i) =>
              <p
                style={{color: color }} 
                key={`custom-tooltip-${label?.replace(/ /g, '-') || 'label'}-${name}-${i}`}>
                {manifest?.[name] || manifest?.[dataKey] || name.toUpperCase()}: {formatValue(value, units)}
              </p>
            )
        }
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