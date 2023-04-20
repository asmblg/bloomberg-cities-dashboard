import React, { useState, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import getNestedValue from '../../utils/getNestedValue';
import PropTypes from 'prop-types';

import './style.css';

const SelectorWithLegend = ({
  // options, 
  // colors, 
  setter,
  config,
  // setterKey,
  // getterKey,
  getter,
  data
}) => {

  const {
    getterKey,
    setterKey,
    colors,
    options,
    topFilterKey,
    subFilterKey,
    topFilterMinValue,
    subFilterMinValue
  } = config;

  const baseDataPath = config?.baseDataPath || getter?.[getterKey?.baseDataPath];
  // console.log(baseDataPath);
  // console.log(data);

  const [selectedOption, setSelectedOption] = useState({
    key: getter?.[getterKey?.topSelector],
    legendItems: getter?.[getterKey?.subSelector]
  });
  // const [optionFilters, setOptionFilters] = useState();
  const [optionsArray, setOptionsArray] = useState(options);

  useEffect(() => {
    if (data && baseDataPath) {
      const nestedData = getNestedValue(data, baseDataPath);
      // console.log(nestedData);
      const filterObj = {
        topFilter: [],
        subFilter: []
      };

      if (nestedData && topFilterKey && subFilterKey) {
        const topItems = getNestedValue(nestedData, topFilterKey);
        const subItems = getNestedValue(nestedData, subFilterKey);

        if (topItems) {        
          Object.entries(topItems).forEach(([key, value]) =>{
            if (value) {
              const minValue = Math.min(...Object.values(value).filter(v => !isNaN(parseInt(v))));
              if (minValue > topFilterMinValue ){
                filterObj.topFilter.push(key);
              }
            }
          });
        }
        if (subItems) {
          Object.entries(subItems).forEach(([key, value]) =>{
            // console.log('SUBFILTER', value);
            if (value) {
              const minValue = Math.min(...Object.values(value).filter(v => !isNaN(parseInt(v))));
              // console.log(minValue);
              if (minValue > subFilterMinValue ){
                filterObj.subFilter.push(key);
              }          
            }
          });        
        }


        // setOptionFilters(obj);
        if (options) {
          const filteredOptions = options
            .filter(({ key }) => filterObj.topFilter ?
              (
                filterObj.topFilter.includes(key) ||
                key === 'total'
              )
              : true)
            .map(({ label, key, legendItems }) => ({
              key,
              label,
              legendItems: legendItems ? 
                filterObj.subFilter?
                  legendItems.filter(({ key }) => 
                    filterObj.subFilter ?
                      filterObj.subFilter.includes(key)
                      : true)
                    .map((item, i) => ({
                      ...item,
                      color: colors[i + 1]
                    }))
                  : legendItems.map((item, i) => ({
                    ...item,
                    color: colors[i + 1]
                  }))
                : null        
            }));
          
          setOptionsArray(filteredOptions);        
        }
      }
    }


  }, [getter?.[getterKey?.baseDataPath]]);

  useEffect(() => {
    //RESET TO DEFAULT OPTION
    if (optionsArray?.[0]) {
      const {
        key,
        legendItems,
        label
      } = optionsArray[0];
      setSelectedOption(optionsArray[0]);
      setter(
        [setterKey?.topSelector, setterKey?.subSelector, setterKey?.topSelectorLabel],
        [key, legendItems, label]);    
    }
  }, 
  [getter?.[getterKey?.baseDataPath]]);


  // console.log(optionFilters);

  return optionsArray ?
    <div className='selector-w-legend'>
      {
        optionsArray
          // .filter(({ key }) => optionFilters?.topFilter ?
          //   (
          //     optionFilters?.topFilter.includes(key) ||
          //     key === 'total'
          //   )
          //   : true)
          .map(({ label, key, legendItems }) =>
            <div
              className='selector-w-legend-option'
              key={key}
              onClick={() => {
                const value = {
                  key,
                  legendItems
                };
                // const legendItemKeys = legendItems ?
                //   legendItems
                //     .filter(({ key }) => optionFilters?.subFilter ?
                //       optionFilters?.subFilter.includes(key)
                //       : true)
                //     .map(({ key }) => key)
                //   : null;
                setSelectedOption(value);
                setter(
                  [setterKey.topSelector, setterKey.subSelector, setterKey.topSelectorLabel],
                  [key, legendItems, label]);
              }}
            >
              <div className={`selector-w-legend-label ${selectedOption?.key === key ?
                'selector-w-legend-label-selected'
                : ''
              }`}>
                <Icon
                  name={legendItems?.[0] ?
                    selectedOption?.key === key ?
                      'angle down'
                      : 'angle up'
                    : 'minus'}
                  size={legendItems?.[0] ? 'big' : 'small'}
                />
                <h5>{label}</h5>
                {
                  selectedOption?.key === key ?
                    <svg className='selector-w-legend-selected-svg' height={'15px'} width={'15px'}>
                      <rect fill={legendItems?.[0] ? colors[0] : colors[1] } height={'15px'} width={'15px'} />
                    </svg>
                    : null
                }
              </div>
              {
                selectedOption?.key === key && legendItems ?
                  <div className='selector-w-legend-selected-legend'>
                    {
                      legendItems
                        // .filter(({ key }) => optionFilters?.subFilter ?
                        //   optionFilters?.subFilter.includes(key)
                        //   : true)
                        .map(({ label, key, color }) =>
                          <div
                            key={key}
                            className='selector-w-legend-selected-legend-item'>
                            <h5>{label}</h5>
                            <svg className='selector-w-legend-selected-svg' height={'15px'} width={'15px'}>
                              <rect fill={color} height={'15px'} width={'15px'} />
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
  // options: PropTypes.array,
  // colors: PropTypes.array,
  config: PropTypes.object,
  setter: PropTypes.func,
  getter: PropTypes.object,
  data: PropTypes.object
};

export default SelectorWithLegend;