import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import SelectorMap from '../SelectorMap';


const FlexLayoutElement = ({
  data,
  setter,
  getter,
  layout,
  project 
}) => {
  const { 
    columns,
    rows,
    content,
    height,
    width
  } = layout;

  const elementRef = useRef();
  const type = columns 
    ? 'columns'
    : rows
      ? 'rows'
      : content
        ? 'content'
        : '';

  const elementArray = columns || rows;

  return (
    <div 
      key={elementRef}
      style={{
        height,
        width 
      }
      }
      className={`flex-layout-${type}`}>
      { 
        !content
          ? elementArray.map(element =>
            <FlexLayoutElement
              data={data} 
              setter={setter}
              getter={getter}
              layout={element}
              project={project}            
            />
          ) : content.type === 'selector-map'
              ? <SelectorMap
                 project={project}
                 config={content.config}
                 setter={setter}
               />
              : JSON.stringify(content)
      }
    </div>
  );
};


export default FlexLayoutElement;
