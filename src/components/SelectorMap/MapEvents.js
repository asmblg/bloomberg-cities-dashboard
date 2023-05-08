import { useMapEvents } from 'react-leaflet';
import PropTypes from 'prop-types';

const MapEvents = ({
  setter,
  options
}) => {
  const map = useMapEvents({
    click: () => console.log(setter, options, map)
  });
  return null;
};

MapEvents.propTypes = {
  setter: PropTypes.func,
  options: PropTypes.array
};

export default MapEvents;