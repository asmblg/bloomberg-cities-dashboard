import React from "react";
import InfoIcon from "../InfoIcon"

const renderElement = (json, index) => {
  if (!json || !json.tag) return null;

  const { tag, attributes, content, children, infoIconContent } = json;

  const Element = tag;

  return ( tag !== 'img'
      ? <Element key={`html-element-${index || 'first'}`} {...attributes}>
          {content} {infoIconContent && 
          <div style={{width: 'fit-content', display: 'flex', paddingLeft: '0.5rem'}}>
          <InfoIcon config={infoIconContent} popup /> 
          </div>}
          {children && children.map((child, childIndex) => renderElement(child, childIndex))}
        </Element>
      : <Element key={`html-element-${index || 'first'}`} {...attributes} />


  );
};

const HTML = ({ data }) => {
  return <>{renderElement(data)}</>;
};

export default HTML;