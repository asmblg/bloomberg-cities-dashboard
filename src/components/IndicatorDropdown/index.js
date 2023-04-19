import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './style.css';

const IndicatorSelectDropdown = ({ setter, getter, config, options, selectedOption }) => {
  const key = config?.key;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selection, setSelection] = useState();
  const [subHeading, setSubHeading] = useState();

  const setterKey = config?.setterKey?.selectedOption;

  useEffect(() => setter(config?.setterKey?.selectedOption, config?.indicators[0]), []);

  useEffect(() => {
    if (getter?.[config?.getterKey?.selectedOption] || selectedOption) {
      setSelection(getter?.[config?.getterKey?.selectedOption] || selectedOption || options[0]);
    }
    if (getter?.[config?.getterKey?.subHeading] || config?.subHeading ){  
      setSubHeading(getter?.[config?.getterKey?.subHeading] || config?.subHeading);
    }
  },[
    getter?.[config?.getterKey?.selectedOption],
    getter?.[config?.getterKey?.subHeading],
    selectedOption
  ]);

  // const subHeading = getter?.[config?.getterKey?.subHeading] || options.subHeading;
  // const text = selection?.label || null;

  return (
    <div className='dropdown-container' key={key}>
      <div className='dropdown-header' onClick={() => setDropdownOpen(!dropdownOpen)}>

        <h4>
          {options?.[1] ? (
            <Icon name={!dropdownOpen ? 'angle down' : 'angle up'} size='big' />
          ) : null}
          {selection?.label || getter?.[config?.getterKey?.selectedOption]?.label || ''}
        </h4>
        {
          subHeading ?
            <h4>{subHeading}</h4>
            : null
        }

      </div>
      {dropdownOpen && options?.[1] ? (
        <ul className='dropdown-options-container'>
          {options.map(option =>
            option && option.label && option.key ? (
              <li
                key={`indicator-dropdown-option-${option.key}`}
                className={selection?.key === option.key ? 'selected-option bold-font' : 'unselected-option'}
                onClick={() => {
                  if (selection?.key !== option.key && setter) {
                    setSelection(option);
                    setter(setterKey, option);
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
  ); 
  // : null;
};

IndicatorSelectDropdown.propTypes = {
  selectedOption: PropTypes.object,
  setter: PropTypes.func,
  getter: PropTypes.object,
  config: PropTypes.object,
  setterKey: PropTypes.string,
  options: PropTypes.array
};

export default IndicatorSelectDropdown;
