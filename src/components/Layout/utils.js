import { viewBreakpoints } from './config';

const getViewType = width =>
  width >= viewBreakpoints.tablet
    ? 'desktop'
    : width <= viewBreakpoints.tablet && width >= viewBreakpoints.mobile
      ? 'tablet'
      : 'mobile';


export { getViewType };