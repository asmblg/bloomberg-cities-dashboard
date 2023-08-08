const handleElementStyle = (
  style,
  // mobileStyle,
  height,
  width,
  viewType,
  // tabletStyle
) => {
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

  if (viewType === 'mobile' || viewType === 'tablet') {
    obj.height = 'fit-content';
  }
  return obj;
};

export { handleElementStyle };
