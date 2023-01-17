import { useEffect } from "react";
import useHttp from "../hooks/use-http";

import { getPictureRequest } from "../lib/api";
import Gallery from "../components/Layout/Gallery";
import Loader from "../components/Layout/LoaderAndAlert";

// component
const GalleryPage: React.FC = () => {
  const {
    sendHttpRequest: getPictureHttpRequest,
    statut: getPictureStatut,
    data: imagesData,
  } = useHttp(getPictureRequest);

  useEffect(() => {
    getPictureHttpRequest();
  }, [getPictureHttpRequest]);

  // error: affichage des images impossibles
  return (
    <section>
      {!imagesData && <Loader statut={getPictureStatut} />}
      {imagesData && (
        <>
          <Gallery
            imagesData={imagesData.filter(
              (image) => image.shelter_id?.number === 0
            )}
            shelterNumber={0}
          />
          <Gallery
            imagesData={imagesData.filter(
              (image) => image.shelter_id?.number === 1
            )}
            shelterNumber={1}
          />
        </>
      )}
    </section>
  );
};

export default GalleryPage;
