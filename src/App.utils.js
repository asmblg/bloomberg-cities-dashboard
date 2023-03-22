import { getConfig } from './utils/API';

const handleConfig = async (pathname, defaultCity, defaultDashboardType) => {
  try {
    const pathnameArr = pathname.split('/').filter(val => val);
    const pathnameCity = pathnameArr[0];
    const pathnameDashboardType = pathnameArr[1];
    const projectName = pathnameCity?.toLowerCase() || defaultCity;
    const projectType = pathnameDashboardType || defaultDashboardType;

    const initialConfig = await getConfig(projectName, projectType);

    if (initialConfig) {
      return {
        config: initialConfig,
        redirect: pathnameDashboardType?.toLowerCase() !== initialConfig.dashboardType
      };
    } else {
      const defaultConfig = await getConfig(defaultCity, defaultDashboardType);

      if (defaultConfig) {
        return {
          config: defaultConfig,
          redirect: true
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

export { handleConfig };