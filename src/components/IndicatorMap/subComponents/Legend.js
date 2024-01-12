import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
// import formatValue from '../../../utils/formatValue';

import { formatLegendLabel } from '../utils';

const Legend = ({ indicator, bins, strokeColor }) => {
  const [legendOpen, setLegendOpen] = useState(true);
  const sortedBins = [...bins].sort((a, b) => parseFloat(b.percentile) - parseFloat(a.percentile));

  return (
    <div className='map-legend'>
      {
        legendOpen
          ? <>
            <div className='legend-close-icon' onClick={() => setLegendOpen(false)}><Icon name='ellipsis horizontal'/></div>
            <h4>{indicator.label}</h4>
            <ul className='legend-bins'>
              {sortedBins.map(({ color, label }) => (
                <li key={`legend-bin-${color}`} className='legend-bin'>
                  <svg height={'15px'} width={'15px'}>
                    <rect height={'15px'} width={'15px'} fill={color} stroke={strokeColor} />
                  </svg>
                  <h5>{formatLegendLabel(label, indicator.units)}</h5>
                </li>
              ))}
            </ul>
          </>
          : <div onClick={() => setLegendOpen(true)}><Icon size='large' name='bars'/></div>
      }

    </div>
  );
};

Legend.propTypes = {
  indicator: PropTypes.object,
  bins: PropTypes.array,
  strokeColor: PropTypes.string
};

export default Legend;
