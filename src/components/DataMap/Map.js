import {useMapEvents} from 'react-leaflet';
import leaflet from 'leaflet';

const Map = ({colorData, tractGeoJSON})=> {
  // console.log(colorData);
  // const geojson = leaflet.GeoJSON(tractGeoJSON)
  // const geojsonLayer = leaflet.GeoJSON(tractGeoJSON);
  // console.log(geojsonLayer);
  const map = useMapEvents({
    load() {
      const layer = leaflet.geoJSON(tractGeoJSON.features, {
        style: {
          color: 'black',
          weight: 1
        }
      })
      console.log(tractGeoJSON);
      map.addLayer(layer)
    }
  });


  // const map = useMap()
  // map.addLayer(geojson);
  // map.addLayer(geojson);
  // console.log(map)
}

export default Map;