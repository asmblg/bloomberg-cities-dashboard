import { viewBreakpoints } from './config';

const handleViewType = () => {
  // Note: window.innerWidth lowest value will be 320.
  const width = window.innerWidth;
  console.log(width);

  return width > viewBreakpoints.tablet
    ? 'desktop'
    : width <= viewBreakpoints.tablet && width >= viewBreakpoints.mobile
      ? 'tablet'
      : 'mobile';
};

export { handleViewType };
