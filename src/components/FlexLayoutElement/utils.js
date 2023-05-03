const handleElementStyle = (style, mobileStyle, height, width, viewType, tabletStyle) => {
  let obj = {};

  if (height) {
    obj.height = height;
  }

  if (width) {
    obj.width = width;
  }

  if (style) {
    obj = {
      ...obj,
      ...style
    };
  }

  if (viewType !== 'desktop' && tabletStyle) {
    obj = {
      ...obj,
      ...tabletStyle
    };
  }

  if (viewType === 'mobile' && mobileStyle) {
    obj = {
      ...obj,
      ...mobileStyle
    };
  }
  return obj;
};

export { handleElementStyle };
