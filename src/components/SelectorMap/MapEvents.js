import { useMapEvents } from 'react-leaflet';
import PropTypes from 'prop-types';

const MapEvents = ({
  setter,
  options,
  active
}) => {
  useMapEvents({

    click: () =>{
      if (active)  {
        setter(null, options[0]);
      }
    }
  });
  return null;
};

MapEvents.propTypes = {
  setter: PropTypes.func,
  options: PropTypes.array,
  active: PropTypes.bool
};

export default MapEvents;