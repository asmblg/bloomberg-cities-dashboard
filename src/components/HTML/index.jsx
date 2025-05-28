import React from "react";

const renderElement = (json, index) => {
  if (!json || !json.tag) return null;

  const { tag, attributes, content, children } = json;

  const Element = tag;

  return ( tag !== 'img'
      ? <Element key={`html-element-${index || 'first'}`} {...attributes}>
          {content}
          {children && children.map((child, childIndex) => renderElement(child, childIndex))}
        </Element>
      : <Element key={`html-element-${index || 'first'}`} {...attributes} />


  );
};

const HTML = ({ data }) => {
  return <>{renderElement(data)}</>;
};

export default HTML;