import { getConfig } from './utils/API';

const handleConfig = async pathname => {
  try {
    const pathnameArr = pathname.split('/').filter(val => val);
    const pathnameCity = pathnameArr[0];
    const projectName = pathnameCity?.toLowerCase();
    const initialConfig = await getConfig(projectName);

    console.log(initialConfig);
    if (initialConfig) {
      return {
        config: initialConfig,
        redirect: false
      };
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
