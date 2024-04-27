// hook import
import { useEffect } from "react";

// other import
import L from "leaflet";
import { Phone } from "@mui/icons-material";
import { Marker, Popup } from "react-leaflet";

// component import
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { Box, CardMedia, Divider, Typography } from "@mui/material";

// custom icon import
import defaultIcon from "../../icons/defaultIcon";

// styled component import
import { StyledBox, StyledCard, StyledCardContent, StyledLink } from "./style";

let filteredBreweries = null;

// Component
const BreweryMarker = ({
  data,
  getGeoFilter,
  getRadiusFilter,
  getSearchbarFilter,
  setBreweriesByFilter,
}) => {
  const geoFilter = getGeoFilter();
  const radiusFilter = getRadiusFilter();
  const searchbarFilter = getSearchbarFilter();
  let centerPoint;

  if (radiusFilter) {
    const { coordinates } = radiusFilter;
    centerPoint = L.latLng(coordinates);
  }

  filteredBreweries = data?.filter((brewery) => {
    let filterByRadius;
    let filterByGeo;
    let filterBySearchbar;
    let currentPoint;

    if (!brewery.title && !brewery.address) return false;

    if (centerPoint) {
      currentPoint = L.latLng(brewery.lat, brewery.lon);
      filterByRadius =
        centerPoint.distanceTo(currentPoint) / 1000 <= radiusFilter.radius; // 'distanceTo' method get distance between two points // 'distanceTo' function works as meters, so we divide by 1000 to get the value in kilometers
    }
    if (geoFilter) {
      // 'booleanPointInPolygon' check if current feature coordinate points are present in the selected continent (geoFilter), return 'true' or 'false'
      filterByGeo = booleanPointInPolygon(
        [brewery.lon, brewery.lat],
        geoFilter
      );
    }

    if (searchbarFilter) {
      const title = brewery.title.toLowerCase().trim();
      const address = brewery.address.toLowerCase().trim();

      filterBySearchbar =
        title.includes(searchbarFilter) || address.includes(searchbarFilter);
    }

    let doFilter = true;

    if (geoFilter && radiusFilter && searchbarFilter) {
      doFilter = filterByGeo && filterByRadius && filterBySearchbar;
    } else if (geoFilter && radiusFilter && !searchbarFilter) {
      doFilter = filterByGeo && filterByRadius;
    } else if (geoFilter && !radiusFilter && !searchbarFilter) {
      doFilter = filterByGeo;
    } else if (radiusFilter && !geoFilter && !searchbarFilter) {
      doFilter = filterByRadius;
    } else if (!radiusFilter && !geoFilter && searchbarFilter) {
      doFilter = filterBySearchbar;
    } else if (!radiusFilter && geoFilter && searchbarFilter) {
      doFilter = filterByGeo && filterBySearchbar;
    } else if (radiusFilter && !geoFilter && searchbarFilter) {
      doFilter = filterByRadius && filterBySearchbar;
    }
    return doFilter;
  });

  useEffect(() => {
    if (filteredBreweries && (radiusFilter || geoFilter || searchbarFilter)) {
      let filter;

      if (geoFilter && radiusFilter && searchbarFilter) {
        filter = ["Autour de moi", geoFilter.properties.nom, searchbarFilter];
      } else if (geoFilter && radiusFilter && !searchbarFilter) {
        filter = ["Autour de moi", geoFilter.properties.nom];
      } else if (geoFilter && !radiusFilter && !searchbarFilter) {
        filter = [geoFilter.properties.nom];
      } else if (radiusFilter && !geoFilter && !searchbarFilter) {
        filter = ["Autour de moi"];
      } else if (!radiusFilter && !geoFilter && searchbarFilter) {
        filter = [searchbarFilter];
      } else if (!radiusFilter && geoFilter && searchbarFilter) {
        filter = [geoFilter.properties.nom, searchbarFilter];
      } else if (!geoFilter && radiusFilter && searchbarFilter) {
        filter = ["Autour de moi", searchbarFilter];
      }
      setBreweriesByFilter({
        filter,
        value: filteredBreweries,
      });
    } else setBreweriesByFilter({});
  }, [radiusFilter, geoFilter, setBreweriesByFilter, searchbarFilter]);

  return filteredBreweries?.map((brewery) => {
    const parsedImage = JSON.parse(brewery.image);

    return (
      <Marker
        position={[brewery.lat, brewery.lon]}
        icon={defaultIcon}
        key={brewery.id}
      >
        <Popup>
          <StyledCard elevation={0}>
            {parsedImage && (
              <CardMedia
                component="img"
                image={parsedImage.path}
                alt={`image/logo brasserie '${brewery.title}'`}
              />
            )}
            <StyledCardContent>
              <Box>
                <Typography variant="h5" component="h5">
                  {brewery.title}
                </Typography>
                <Typography
                  fontSize="1rem"
                  color="gray"
                  variant="p"
                  component="p"
                >
                  {brewery.address}
                </Typography>
              </Box>
              <StyledBox>
                <Phone />
                <Typography fontSize="1rem" variant="p" component="p">
                  {brewery.phone}
                </Typography>
              </StyledBox>
              <Divider />
              <StyledLink to={`/brewery/${brewery.id}`}>
                Plus de détails
              </StyledLink>
            </StyledCardContent>
          </StyledCard>
        </Popup>
      </Marker>
    );
  });
};

export default BreweryMarker;