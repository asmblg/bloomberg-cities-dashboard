const handleElementStyle = (style, mobileStyle, height, width, viewType) => {
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

  if (viewType !== 'desktop' && mobileStyle) {
    obj = {
      ...obj,
      ...mobileStyle
    };
  }
  return obj;
};

export { handleElementStyle };
