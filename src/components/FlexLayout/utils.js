const handleStyle = (isColumn, viewType, mobileStyle, tabletStyle) => {
  let obj = {};
  obj.flexDirection = isColumn ? 'row' : 'column';

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

export { handleStyle };
