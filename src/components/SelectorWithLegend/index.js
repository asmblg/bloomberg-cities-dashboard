import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import './style.css';

const SelectorWithLegend = ({ 
  options, 
  colors, 
  setter, 
  setterKey 
}) => {

  const [selectedOption, setSelectedOption] = useState();


  return options ? 
    <div className='selector-w-legend'>
      {
        options.map(({label, key, legendItems}) =>
          <div 
            className='selector-w-legend-option'
            key={key}
            onClick={() => {
              const value = {
                key,
                legendItems
              };
              setSelectedOption(value);
              setter(setterKey,value);
            }}
          >
            <div className={`selector-w-legend-label ${selectedOption?.key === key ? 
              'selector-w-legend-label-selected'
              : ''
            }`}>
              <Icon 
                name={legendItems ? 
                  selectedOption?.key === key ? 
                    'angle down' 
                    : 'angle up'
                  : 'minus'} 
                size={legendItems ? 'big' : 'small' }
              />
              <h4>{label}</h4>
              {
                selectedOption?.key === key ?
                  <svg className='selector-w-legend-selected-svg' height={'15px'} width={'15px'}>
                    <rect fill={colors[0]} height={'15px'} width={'15px'} />
                  </svg>
                  : null            
              }
            </div>
            {
              selectedOption?.key === key && legendItems ?
                <div className='selector-w-legend-selected-legend'>
                  {
                    legendItems.map(({label, key}, i) =>
                      <div
                        key={key} 
                        className='selector-w-legend-selected-legend-item'>
                        <h4>{label}</h4>
                        <svg className='selector-w-legend-selected-svg' height={'15px'} width={'15px'}>
                          <rect fill={colors[i + 1]} height={'15px'} width={'15px'} />
                        </svg>
                      </div>
                    )
                  }
                </div>
                : null
            }
          </div>
        )
      }
    </div>
    : null;


};

SelectorWithLegend.propTypes = {
  options: PropTypes.array,
  colors: PropTypes.array,
  setter: PropTypes.func,
  setterKey: PropTypes.string
};

export default SelectorWithLegend;