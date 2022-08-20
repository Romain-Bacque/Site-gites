import { useEffect } from "react";
import useHttp from "../hooks/use-http";

import { getPictureRequest } from "../lib/api";
import Gallery from "../components/Layout/Gallery";
import Loader from "../components/Layout/Loader";

const GalleryPage = () => {
  const {
    sendHttpRequest: getPictureHttpRequest,
    statut: getPictureStatut,
    data: imagesData,
  } = useHttp(getPictureRequest);

  useEffect(() => {
    getPictureHttpRequest();
  }, [getPictureHttpRequest]);

  return (
    <section>
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
          <Gallery
            imagesData={imagesData.filter(
              (image) => image.shelter.number === 0
            )}
            shelter={0}
          />
          <Gallery
            imagesData={imagesData.filter(
              (image) => image.shelter.number === 1
            )}
            shelter={1}
          />
        </>
      )}
    </section>
  );
};

export default GalleryPage;
