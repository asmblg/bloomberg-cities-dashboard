import { useEffect } from 'react';
import { getConfig } from './utils/API';

const handleConfig = async pathname => {
  try {
    const pathnameArr = pathname.split('/').filter(val => val);
    const pathnameCity = pathnameArr[0];
    const projectName = pathnameCity?.toLowerCase();

    const initialConfig = await getConfig(projectName);

    // Set CSS Variables based on initialConfig
    if (initialConfig?.fonts) {
      handleRootVariables(initialConfig.fonts);
    }


    // const initialConfig = require(`./dev/${projectName}.json`);

    if (initialConfig) {
      return {
        config: initialConfig,
        redirect: false
      };
    } else {
      return {
        config: null,
        redirect: '/'
      };
    }
  } catch (err) {
    console.log(err);
    return {
      config: null,
      redirect: '/'
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

  if (config?.fonts) {
    const root = document.documentElement;
    Object.entries(config.fonts).forEach(([name, value]) => {
      root.style.setProperty(`--${name}`, value);
    });  }
  return;
};

const useAutoIframeHeight = (deps = []) => {
  useEffect(() => {
    const sendHeight = () => {
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      console.log('Sending height', height);
      window.parent.postMessage({ type: 'setHeight', height }, '*');
    };

    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);

    // Initial call on load or when deps change
    sendHeight();

    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', sendHeight);
      window.removeEventListener('resize', sendHeight);
    };
  }, deps); // will re-run if any dependency changes
};



export { handleConfig, handleRootVariables, useAutoIframeHeight };
