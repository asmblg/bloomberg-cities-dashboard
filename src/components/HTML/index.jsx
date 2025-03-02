import React from "react";

const renderElement = (json, index) => {
  if (!json || !json.tag) return null;

  const { tag, attributes, content, children } = json;

  const Element = tag;

  return (
    <Element key={`html-element-${index || 'first'}`} {...attributes}>
      {content}
      {children && children.map((child, childIndex) => renderElement(child, childIndex))}
    </Element>
  );
};

const HTML = ({ data }) => {
  return <>{renderElement(data)}</>;
};

export default HTML;