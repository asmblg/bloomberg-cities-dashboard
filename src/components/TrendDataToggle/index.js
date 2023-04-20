import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'semantic-ui-react';

import { handleSetter } from './utils';
import './style.css';

const TrendDataToggle = ({ config, getter, setter }) => {
  const ref = useRef();

  const toggleValue = getter?.[config?.getterKey?.toggleValue]
    ? getter?.[config.getterKey.toggleValue]
    : getter === 'YtY' || getter === 'QtQ'
      ? getter
      : null;

  useEffect(() => {
    handleSetter(config?.setterKey?.toggleValue, 'QtQ').then(({ setterKey, value }) => {
      if (setterKey && value) {
        setter(setterKey, value);
      } else if (value) {
        setter(value);
      }
    });
  }, []);

  return (
    <div ref={ref} className='data-toggle-container'>
      <h5>Quarter-to-Quarter</h5>
      <Checkbox
        toggle
        checked={(toggleValue && toggleValue === 'YtY') || false}
        onChange={(e, { checked }) => {
          if (config?.setterKey?.toggleValue) {
            setter(config.setterKey.toggleValue, checked ? 'YtY' : 'QtQ');
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
