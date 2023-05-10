import { viewBreakpoints } from './config';

const handleViewType = () => {
  // Note: window.innerWidth lowest value will be 320.
  const width = window.innerWidth;
  const height = window.innerHeight;

  // return width > viewBreakpoints.tablet
  //   ? 'desktop'
  //   : width <= viewBreakpoints.tablet && width >= viewBreakpoints.mobile
  //     ? 'tablet'
  //     : 'mobile';
    
  return width <= viewBreakpoints.mobile 
    ? 'mobile' 
    : height > width 
      ? 'tablet' 
      : 'desktop'; 
};

const getCurrentRoute = (project, sectionKeys, pathname) => {
  const keys = [...sectionKeys];
  keys.push('about');

  const parsedRoute = pathname.split('/').filter(str => str);
  const routeSection = parsedRoute[1];

  const isValidSection = keys.includes(routeSection);
  const currentSection = routeSection && isValidSection ? routeSection : 'home';
  // routeSection === home case handles situation where user types home at end of URL - will redirect to home section with correct URL
  // added case because without it the route will not hit display a valid section
  return { section: currentSection, redirect: !isValidSection || routeSection === 'home' };
};

export { handleViewType, getCurrentRoute };
