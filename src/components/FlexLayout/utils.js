const handleStyle = (
  isColumn, 
  viewType, 
  flip
  // mobileStyle, 
  // tabletStyle
) => {
  let obj = {};
  obj.flexDirection = isColumn && 
    viewType !== 'mobile' &&
    viewType !== 'tablet' ? 
    'row' : 'column';
  if (viewType === 'mobile') {
    obj.height =  'fit-content';
  }
  return obj;
};

export { handleStyle };
