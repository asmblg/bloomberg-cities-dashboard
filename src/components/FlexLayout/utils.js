const handleStyle = (isColumn, viewType, mobileStyle, tabletStyle) => {
  let obj = {};
  obj.flexDirection = isColumn ? 'row' : 'column';

  if (viewType === 'tablet' && tabletStyle) {
    obj = {
      ...obj,
      ...tabletStyle
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

export { handleStyle };
