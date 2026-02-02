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
  lng,
  projectedData,
  comparisonData
  // quarterDateFormat
}) => {
  if (active && payload?.[0]) {
    return (
      <div className='custom-tooltip'>
        {
          comparisonData
          ? <h4 className='custom-tooltip-label'>
              {formatQuarterDate(label || payload?.[0]?.name, 'QX YYYY', lng)}
            </h4>
          : null
        }
        {
          payload
            // .reverse()
            .filter(({}, i) => projectedData && payload[1] ? i === 1 : true)
            .sort((a,b) => Number(b.value) - Number(a.value))
            .map(({name, value, color, dataKey, payload: innerPayload}, i) =>
              comparisonData 
              ? <div
                  className='simple-data'
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '10px',
                    // color: color || innerPayload?.fillColor,
                    // fontSize:  filter && !filter?.includes(name) ? '.5rem' : null,
                    // lineHeight: filter && !filter?.includes(name) ? '.5rem' : '.7rem'
                  }} 
                  key={`custom-tooltip-${label?.replace(/ /g, '-') || 'label'}-${name}-${i}`}>
                                <h5 className='simple-units'>                
                  {manifest?.[name] || manifest?.[dataKey] || name.toUpperCase()}
                </h5>
                <h3 className='bold-font'>
                {formatValue(value, units)}
                </h3>

                {/* <h5 className='simple-indicator-date'>
                    {formatQuarterDate(label || payload?.[0]?.name, 'QX YYYY', lng)}
                </h5>  */}
                </div>
             : <div
                className='simple-data'
                style={{
                  width: '100%',
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
              <h5 className='simple-indicator-date'>
                  {formatQuarterDate(label || payload?.[0]?.name, 'QX YYYY', lng)}
              </h5> 
              </div>
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