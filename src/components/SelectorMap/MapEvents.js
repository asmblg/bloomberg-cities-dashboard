import { useMapEvents } from 'react-leaflet';
import PropTypes from 'prop-types';

const MapEvents = ({
  setter,
  options,
  active
}) => {
  useMapEvents({
    // moveend: ({target}) => {
    //   const center = target.getCenter();
    //   console.log('center', center);
    //     // setter(null, options[0]);
    // },

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