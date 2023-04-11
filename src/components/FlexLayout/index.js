import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';


const FlexLayout = ({
  layout:
  {
    columns, rows
  }, 
  data}) => {

  const layoutRef = useRef();
  const [getter, setter] = useState({});

  const elementArray = columns || rows;
  
  const handleSetter = (setterKey, value) => setter({
    ...getter,
    [setterKey]: value
  });

  return (
    <div className='flex-layout'>
      {elementArray.map(element => 
        <FlexLayoutElement
          data={data} 
          key={layoutRef} 
          layout={element}
          setter={handleSetter}
          getter={getter}
        />
      )}
    </div>
  );

};