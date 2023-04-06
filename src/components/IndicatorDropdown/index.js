import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './style.css';

const IndicatorSelectDropdown = ({ selectedOption, setter, options }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // selectedOption && options objects must have a short_name property
  const text = selectedOption?.label || null;
  // selectedOption && options objects must have a key property
  const key = selectedOption?.key || null;

  return text && key && setter ? (
    <div className='dropdown-container'>
      <div className='dropdown-header' onClick={() => setDropdownOpen(!dropdownOpen)}>
        {options && options[0] ? (
          <Icon name={!dropdownOpen ? 'angle down' : 'angle up'} size='big' />
        ) : null}
        <h3>{text}</h3>
      </div>
      {dropdownOpen && options && options[0] ? (
        <ul className='dropdown-options-container'>
          {options.map(option =>
            option && option.label && option.key ? (
              <li
                key={`indicator-dropdown-option-${option.key}`}
                className={key === option.key ? 'selected-option bold-font' : 'unselected-option'}
                onClick={() => {
                  if (key !== option.key) {
                    setter(option);
                  }
                  setDropdownOpen(false);
                }}
              >
                {option.label || null}
              </li>
            ) : null
          )}
        </ul>
      ) : null}
    </div>
  ) : null;
};

IndicatorSelectDropdown.propTypes = {
  selectedOption: PropTypes.object,
  setter: PropTypes.func,
  options: PropTypes.array
};

export default IndicatorSelectDropdown;
