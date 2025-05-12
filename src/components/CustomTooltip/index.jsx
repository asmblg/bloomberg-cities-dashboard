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
  if (active && payload?.[0]) {
    return (
      <div className='custom-tooltip'>

        {
          payload
            // .filter(({name}) => filter?.length > 0 ? filter.includes(name) : true)
            .sort((a,b) => Number(b.value) - Number(a.value))
            .map(({name, value, color, dataKey, payload: innerPayload}, i) =>
              <div
                style={{
                  // color: color || innerPayload?.fillColor,
                  fontSize:  filter && !filter?.includes(name) ? '.6rem' : null,
                  lineHeight: filter && !filter?.includes(name) ? '.6rem' : '.9rem'
                }} 
                key={`custom-tooltip-${label?.replace(/ /g, '-') || 'label'}-${name}-${i}`}>
              <h2 className='bold-font'>
              {formatValue(value, units)}
              </h2>
              <h5 className='simple-units'>                
                {manifest?.[name] || manifest?.[dataKey] || name.toUpperCase()}
              </h5>
              </div>
            )
        }
        <h5 className='simple-indicator-date'>
            {formatQuarterDate(label || payload?.[0]?.name, 'QX YYYY')}
        </h5> 
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