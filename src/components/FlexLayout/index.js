import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import FlexLayoutElement from '../FlexLayoutElement';
import './style.css';


const FlexLayout = ({
  layout: {
    columns, rows, height, width
  }, 
  data,
  project
}) => {

  const [getter, setter] = useState({});

  const elementArray = columns || rows;
  
  const handleSetter = (setterKey, value) => setter({
    ...getter,
    [setterKey]: value
  });

  console.log(getter);

  return (
    <div className='flex-layout'
      style={{
        flexDirection: columns
          ? 'column'
          : 'row'
      }}
    >
      {elementArray.map((element) => 
        <FlexLayoutElement
          key={''}
          data={data}
          project={project} 
          layout={element}
          // height={height}
          // width={width}
          setter={handleSetter}
          getter={getter}
        />
      )}
    </div>
  );
};

export default FlexLayout;