export const handleViewSwitch = ({ viewKey, viewOptions, setter }) => {
  const newView = viewOptions?.find(({ key }) => key === viewKey);
  if (newView) {
    setter(newView);
  }
};
