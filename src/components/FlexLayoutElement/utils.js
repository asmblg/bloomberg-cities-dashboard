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
  if (viewType === 'mobile') {
    if (obj.borderRight) {
      obj.borderBottom = obj.borderRight;
      obj.marginBottom = '20px';      
      // obj.paddingBottom = '20px';
      obj.borderBottomColor = 'rgb(245, 243, 243)';


      delete obj.borderRight;
    }
    if (obj.borderLeft) {
      obj.borderTop = obj.borderLeft;
      obj.marginTop = '20px';
      // obj.paddingTop = '20px';
      obj.borderTopColor = 'rgb(245, 243, 243)';

      delete obj.borderLeft;
    }
  }
  return obj;
};

export { handleElementStyle };
