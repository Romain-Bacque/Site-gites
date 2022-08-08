import { useEffect } from "react";
import useHttp from "../hooks/use-http";

import { getPictureRequest } from "../lib/api";
import Gallery from "../components/Layout/Gallery";
import Loader from "../components/Layout/Loader";

let filteredImagesList1, filteredImagesList2;
const GalleryPage = () => {
  const {
    sendHttpRequest: getPictureHttpRequest,
    statut: getPictureStatut,
    data: imagesData,
  } = useHttp(getPictureRequest);

  useEffect(() => {
    getPictureHttpRequest();
  }, [getPictureHttpRequest]);

  if (imagesData) {
    filteredImagesList1 = imagesData.filter(
      (image) => image.shelter.number === 0
    );
    filteredImagesList2 = imagesData.filter(
      (image) => image.shelter.number === 1
    );
  }

  return (
    <>
      {!imagesData && (
        <Loader
          statut={getPictureStatut}
          message={{
            success: null,
            error: "Affichage des images impossible.",
          }}
        />
      )}
      {imagesData && (
        <>
          <Gallery imagesList={filteredImagesList1} shelterNumber={0} />
          <Gallery imagesList={filteredImagesList2} shelterNumber={1} />
        </>
      )}
    </>
  );
};

export default GalleryPage;
