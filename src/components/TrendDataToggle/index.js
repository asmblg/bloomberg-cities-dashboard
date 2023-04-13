import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'semantic-ui-react';

import './style.css';

const TrendDataToggle = ({ config, getter, setter }) => {
  const ref = useRef();

  useEffect(() => {
    if (config && !getter[config.getterKey]) {
      setter(config.setterKey, 'QtQ');
    } else {
      setter('QtQ');
    }
  }, []);

  return (
    <div ref={ref} className='data-toggle-container'>
      <h5>Quarter-to-Quarter</h5>
      <Checkbox
        toggle
        checked={(config && getter[config.getterKey] === 'YtY') || getter === 'YtY'}
        onChange={(e, { checked }) => {
          if (config) {
            setter(config.setterKey, checked ? 'YtY' : 'QtQ');
          } else {
            setter(checked ? 'YtY' : 'QtQ');
          }
        }}
      />
      <h5>Year-to-Year</h5>
    </div>
  );
};

TrendDataToggle.propTypes = {
  config: PropTypes.object,
  getter: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  setter: PropTypes.func
};

export default TrendDataToggle;
