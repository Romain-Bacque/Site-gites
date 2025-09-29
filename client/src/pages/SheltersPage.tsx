import useHttp from "../hooks/use-http";
import Shelters from "../components/Layout/Shelters";
import { useEffect } from "react";
import useLoading from "../hooks/use-loading";
import { getSheltersWithPicturesRequest } from "../lib/api";

// component
const SheltersPage: React.FC = () => {
  const handleLoading = useLoading();
  const {
    sendHttpRequest: getShelterHttpRequest,
    statut: getSheltersRequestStatut,
    data: sheltersData,
    error: getSheltersRequestError,
  } = useHttp(getSheltersWithPicturesRequest);

  useEffect(() => {
    getShelterHttpRequest();
  }, [getShelterHttpRequest]);
  
  // shelters request loading handling
  useEffect(() => {
    if (getSheltersRequestStatut) {
      handleLoading(
        getSheltersRequestStatut,
        null,
        null,
        getSheltersRequestError
      );
    }
  }, [getSheltersRequestError, getSheltersRequestStatut, handleLoading]);

  return <Shelters sheltersData={sheltersData} />;
};

export default SheltersPage;
