import { useEffect } from "react";
import useHttp from "../hooks/use-http";

import { getPictureRequest } from "../lib/api";
import Gallery from "../components/Layout/Gallery";
import { loadingActions } from "../store/loading";
import { useDispatch } from "react-redux";
import { HTTPStateKind } from "../global/types";

// interfaces
export type GalleryPageProps = {
  sheltersData:
    | {
        _id: string;
        title: string;
        number: number;
      }[]
    | null;
};

// component
const GalleryPage: React.FC<GalleryPageProps> = ({ sheltersData }) => {
  const dispatch = useDispatch();
  const {
    sendHttpRequest: getPictureHttpRequest,
    statut: getPictureStatut,
    data: imagesData,
    error: getPictureRequestError,
  } = useHttp(getPictureRequest);

  useEffect(() => {
    getPictureHttpRequest();
  }, [getPictureHttpRequest]);

  // shelters request loading handling
  useEffect(() => {
    if (getPictureStatut) {
      dispatch(loadingActions.setStatut(getPictureStatut));
      dispatch(
        loadingActions.setMessage({
          success: null,
          error: getPictureRequestError,
        })
      );
    }
  }, [dispatch, getPictureStatut, getPictureRequestError]);

  return (
    <section>
      {imagesData &&
        sheltersData?.map((shelterData) => (
          <Gallery
            key={shelterData._id}
            imagesData={imagesData.filter(
              (image) => image.shelter_id === shelterData._id
            )}
            shelterTitle={shelterData.title}
            shelterId={shelterData._id}
          />
        ))}
      {getPictureStatut === HTTPStateKind.ERROR && (
        <p className="text-center">Les albums sont indisponibles.</p>
      )}
    </section>
  );
};

export default GalleryPage;
