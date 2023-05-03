const handleStyle = (isColumn, viewType, mobileStyle, tabletStyle) => {
  let obj = {};
  obj.flexDirection = isColumn ? 'row' : 'column';

  if (viewType !== 'desktop' && tabletStyle) {
    console.log('hit', { tabletStyle });
    obj = {
      ...obj,
      ...tabletStyle
    };
  }

  if (viewType === 'mobile' && mobileStyle) {
    console.log('hit', { mobileStyle });
    obj = {
      ...obj,
      ...mobileStyle
    };
  }
  // console.log({ obj });
  return obj;
};

export { handleStyle };
