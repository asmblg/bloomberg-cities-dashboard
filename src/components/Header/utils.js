import { useLocation } from 'react-router-dom';

const getCurrentRoute = (project, sectionKeys, viewType) => {
  // Gets current route from React Router
  const { pathname } = useLocation();
  const keys = [...sectionKeys];

  if (viewType !== 'desktop') {
    keys.push('about', 'docs');
  }
  // Grab section from end of pathname and ensure it is in the section keys
  const currentSection = pathname
    .split('/')
    .filter(str => str && str !== project && keys.includes(str))[0];

  return currentSection;
};

export { getCurrentRoute };
