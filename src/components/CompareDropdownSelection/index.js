import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import getNestedValue from '../../utils/getNestedValue';
import './style.css';

const CompareDropdownSelection = ({ config, getter, setter, data }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectOptions, setSelectOptions] = useState(null);
  const compareDropdownRef = useRef();

  const {
    title,
    comparand,
    defaultSelected,
    options,
    optionsDataPath,
    getterKey,
    setterKey,
    style,
    svgStyle,
    legendStyle
  } = config;

  const selectedOption =
    getterKey?.selectedOption && getter?.[getterKey.selectedOption]
      ? getter[getterKey.selectedOption]
      : defaultSelected || null;

  useEffect(() => {
    if (options?.[0] && !optionsDataPath) {
      setSelectOptions(options);

      if (!selectedOption && setterKey?.selectedOption) {
        setter(setterKey.selectedOption, options[0]);
      }
    } else if (optionsDataPath && data) {
      const dataObj = getNestedValue(data, optionsDataPath);
      const optionsArr = dataObj
        ? Object.keys(dataObj).map(key => ({
          text: key,
          key
        }))
        : null;
      if (optionsArr && setterKey?.selectedOption) {
        setSelectOptions(optionsArr);

        if (!selectedOption) {
          setter(setterKey.selectedOption, optionsArr[0]);
        }
      }
    }
  }, [getter, data]);

  return (
    <div
      key={title}
      ref={compareDropdownRef}
      className='compare-dropdown-container'
      style={style || {}}
    >
      <h5 className='bold-font'>{title || ''}</h5>
      <div className='compare-dropdown-legend' style={legendStyle || {}}>
        {comparand ? (
          <div className='main-value-container'>
            <h5>{comparand.text || ''}</h5>
            <svg className='main-value-svg' height={'15px'} width={'15px'}>
              <rect height={'15px'} width={'15px'} />
            </svg>
          </div>
        ) : null}

        {selectOptions && selectOptions[0] && selectedOption ? (
          <div className='option-selection-container'>
            <div className='option-selector' onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div>
                <Icon name='angle down' size='big' />
                <h5>{selectedOption.text}</h5>
              </div>
              {selectedOption.key && selectedOption.key !== 'default' ? (
                <svg className='selected-option-svg' height={'15px'} width={'15px'}>
                  <rect
                    height={'15px'}
                    width={'15px'}
                    style={svgStyle ? { fill: svgStyle.compareColor || svgStyle.mainColor } : {}}
                  />
                </svg>
              ) : null}
            </div>
            {dropdownOpen ? (
              <ul className='compare-options-container'>
                {selectOptions && selectOptions[0]
                  ? selectOptions.map((city, i) => (
                    <li
                      key={`compare-option-${city.key}-${i}`}
                      className={
                        selectedOption.key === city.key
                          ? 'compare-selected-option'
                          : 'compare-unselected-option'
                      }
                      style={{
                        borderBottom:
                          i !== selectOptions.length - 1
                            ? '1px solid var(--secondary-gray-color)'
                            : 'none'
                      }}
                      onClick={() => {
                        if (setterKey?.selectedOption) {
                          setter(setterKey.selectedOption, city);
                        }
                        setDropdownOpen(false);
                      }}
                    >
                      <h5 className={selectedOption.key === city.key ? 'bold-font' : null}>
                        {city.text}
                      </h5>
                    </li>
                  ))
                  : null}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

CompareDropdownSelection.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  getter: PropTypes.object,
  setter: PropTypes.func
};

export default CompareDropdownSelection;
