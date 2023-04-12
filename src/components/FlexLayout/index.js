import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FlexLayoutElement from '../FlexLayoutElement';
import './style.css';

const FlexLayout = ({ layout: { columns, rows }, data, project }) => {
  const [getter, setter] = useState({});

  const elementArray = columns || rows;

  const handleSetter = (setterKey, value) =>
    setter({
      ...getter,
      [setterKey]: value
    });

  return (
    <div
      className='flex-layout'
      style={{
        flexDirection: columns ? 'row' : 'column'
      }}
    >
      {elementArray.map((element, i) => (
        <FlexLayoutElement
          key={`flex-layout-el-${i}`}
          data={data}
          project={project}
          layout={element}
          // height={height}
          // width={width}
          setter={handleSetter}
          getter={getter}
        />
      ))}
    </div>
  );
};

FlexLayout.propTypes = {
  layout: PropTypes.object,
  data: PropTypes.object,
  project: PropTypes.string
};

export default FlexLayout;
