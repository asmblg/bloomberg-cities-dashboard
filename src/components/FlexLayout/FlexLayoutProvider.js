import React, {useState} from 'react';
import FlexLayoutContext from './FlexLayoutContext';
import PropTypes from 'prop-types';


const FlexLayoutProvder = ({ children, initialState }) => {

  const [getter, setter] = useState(initialState || {});
  
  const handleSetter = (setterKey, value) => {
    // console.log('HANDLE SETTER', setterKey);
    const multipleSetters = Array.isArray(setterKey);
    const setterObj = { ...getter };

    if (multipleSetters) {
      setterKey.forEach((key, i) => {
        if (key) {
          setterObj[key] = value[i];
        }
      });
    } else {
      setterObj[setterKey] = value;
    }
    setter(setterObj);

  };
  // Any other state logic here

  return (
    <FlexLayoutContext.Provider value={{ getter, handleSetter }}>
      {children}
    </FlexLayoutContext.Provider>
  );
};

FlexLayoutProvder.propTypes = {
  children: PropTypes.element,
  initialState: PropTypes.object
};

export default FlexLayoutProvder;