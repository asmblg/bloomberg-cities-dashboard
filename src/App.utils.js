import { getConfig } from './utils/API';

const handleConfig = async (pathname, defaultCity) => {
  try {
    const pathnameArr = pathname.split('/').filter(val => val);
    const pathnameCity = pathnameArr[0];
    // const pathnameDashboardType = pathnameArr[1];
    const projectName = pathnameCity?.toLowerCase() || defaultCity;
    // const projectType = pathnameDashboardType || defaultDashboardType;

    const initialConfig = await getConfig(projectName);
    // console.log(pathnameArr);
    // console.log(initialConfig);

    if (initialConfig) {
      return {
        config: initialConfig,
        redirect: false
      };
    } else {
      const defaultConfig = await getConfig(defaultCity);

      if (defaultConfig) {
        return {
          config: defaultConfig,
          redirect: false
        };
      }
    }
  } catch (err) {
    console.log(err);
    return {
      config: null,
      redirect: '404'
    };
  }
};

const handleRootVariables = async config => {
  if (config?.colorPalette) {
    const root = document.documentElement;

    // Loop through the colorPalette object and set each color as a CSS root variable
    Object.entries(config.colorPalette).forEach(([name, value]) => {
      root.style.setProperty(`--${name}`, value);
    });
  }
  return;
};

export { handleConfig, handleRootVariables };
