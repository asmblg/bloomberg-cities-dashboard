const handleElementStyle = (
  style,
  // mobileStyle,
  height,
  width,
  viewType,
  mainLayout,
  firstRecursive,
  
  // isColumns
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

  if (viewType === 'mobile') {
    // obj.height = 'fit-content';
  }
  // if (viewType === 'tablet' && firstRecursive && !isColumns) {
  //   obj.minWidth = '100%';
  // }
  if (viewType === 'mobile') {
    if (mainLayout) {
      obj.gap = '20px';
    }
    if (firstRecursive) {
      obj.gap = '10px';
    }
  }
  if (viewType === 'mobile' || viewType === 'tablet') {
    if (obj.borderRight) {
      obj.borderBottom = obj.borderRight;
      obj.marginBottom = '20px';      
      obj.paddingBottom = '40px';
      obj.borderBottomColor = 'rgb(245, 243, 243)';


      delete obj.borderRight;
    }
    if (obj.borderLeft) {
      obj.borderTop = obj.borderLeft;
      obj.marginTop = '20px';
      obj.paddingTop = '40px';
      obj.borderTopColor = 'rgb(245, 243, 243)';

      delete obj.borderLeft;
    }
  }

  return obj;
};

const sanitizeHTML = html => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};


export { handleElementStyle,  sanitizeHTML };
