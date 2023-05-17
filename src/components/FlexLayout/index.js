import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FlexLayoutElement from '../FlexLayoutElement';

import { handleStyle } from './utils';
import './style.css';

const FlexLayout = ({ 
  initialState,
  layout: { 
    columns,
    rows,
    // mobileStyle,
    // tabletStyle
  }, 
  data, 
  project,
  viewType,
  selectedLink,
  setSelectedLink,
  infoIconConfig,
  setInfoIconConfig
}) => {
  const [getter, setter] = useState(initialState || {});
  const elementArray = columns || rows;

  const handleSetter = (setterKey, value) => {
    const multipleSetters = Array.isArray(setterKey);
    if (multipleSetters) {
      const setterObj = { ...getter };
      setterKey.forEach((key, i) => {
        if (key) {
          setterObj[key] = value[i];
        }
      });
      setter(setterObj);
    } else {
      setter({
        ...getter,
        [setterKey]: value
      });
    }
  };

  // console.log(JSON.stringify(getter));

  return (
    <div
      className='flex-layout'
      style={handleStyle(
        columns, 
        viewType, 
        // mobileStyle, 
        // tabletStyle
      )}
    >
      {elementArray.map((element, i) => (
        <FlexLayoutElement
          key={`flex-layout-el-${i}`}
          data={data}
          project={project}
          layout={element}
          setter={handleSetter}
          getter={getter}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
          viewType={viewType}
          infoIconConfig={infoIconConfig}
          setInfoIconConfig={setInfoIconConfig}
        />
      ))}
    </div>
  );
};

FlexLayout.propTypes = {
  layout: PropTypes.object,
  data: PropTypes.object,
  project: PropTypes.string,
  initialState: PropTypes.object,
  viewType: PropTypes.string,
  selectedLink: PropTypes.string,
  setSelectedLink: PropTypes.func,
  infoIconConfig: PropTypes.object,
  setInfoIconConfig: PropTypes.func
};

export default FlexLayout;
