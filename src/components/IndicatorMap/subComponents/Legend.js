import React from 'react';
import PropTypes from 'prop-types';
// import formatValue from '../../../utils/formatValue';

import { formatLegendLabel } from '../utils';

const Legend = ({ indicator, bins, strokeColor }) => {
  const sortedBins = [...bins].sort((a, b) => parseFloat(b.percentile) - parseFloat(a.percentile));

  return (
    <div className='map-legend'>
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
    </div>
  );
};

Legend.propTypes = {
  indicator: PropTypes.object,
  bins: PropTypes.array,
  strokeColor: PropTypes.string
};

export default Legend;
