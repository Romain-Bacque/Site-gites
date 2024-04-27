import L from "leaflet";
import iconUrl from "../images/beer.png";

const {
  iconSize,
  iconShadow,
  shadowSize,
  shadowAnchor,
  iconAnchor,
  popupAnchor,
  tooltipAnchor,
} = L.Marker.prototype.options.icon.options;

export default L.icon({
  iconUrl,
  iconShadow,
  iconSize,
  shadowSize,
  shadowAnchor,
  iconAnchor,
  popupAnchor,
  tooltipAnchor,
});