import React, { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import {
  deletePictureRequest,
  getCSRF,
  getSheltersWithPicturesRequest,
  postPictureRequest,
} from "../../../lib/api";
import Modal from "../../UI/Modal";
import CropContent from "../CropContent";
import useHTTPState from "../../../hooks/use-http-state";
import GalleryItem from "../GalleryItem";
import { ShelterType } from "./types";
import { HTTPStateKind } from "../../../global/types";

// variable & constante
const initialModalState = {
  show: false,
  crop: false,
  deleteAlert: false,
};
const initialMessageState = {
  message: null,
  alert: null,
  show: false,
};

// component
const Gallery: React.FC = () => {
  const { sendHttpRequest: getCSRFttpRequest } = useHttp(getCSRF);
  const {
    sendHttpRequest: getPictureHttpRequest,
    statut: getPictureStatut,
    data: getPictureRequestData,
    error: getPictureRequestError,
  } = useHttp(getSheltersWithPicturesRequest);
  const {
    sendHttpRequest: postPictureHttpRequest,
    statut: postPictureStatut,
    data: postPictureRequestData,
    error: postPictureRequestError,
  } = useHttp(postPictureRequest);
  const {
    sendHttpRequest: deletePictureHttpRequest,
    statut: deletePictureStatut,
    data: deletePictureRequestData,
    error: deletePictureRequestError,
  } = useHttp(deletePictureRequest);
  const [imageToDelete, setImageToDelete] = useState("");
  const [urlFile, setUrlFile] = useState<{ id: string; file: string } | null>(
    null
  );
  const [sheltersData, setSheltersData] = useState<ShelterType[] | null>(null);
  const [showModal, setShowModal] = useState(initialModalState);
  const [alertStatut, setAlertStatut] = useState(initialMessageState);
  const handleHTTPState = useHTTPState();

  const handleDeleteAlert = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: boolean
  ) => {
    if (value) {
      setImageToDelete(event.currentTarget.dataset.imageId!);
    }
    setShowModal({
      show: value,
      crop: false,
      deleteAlert: true,
    });
  };

  const handleDeleteImage = () => {
    setShowModal(initialModalState);
    imageToDelete && deletePictureHttpRequest(imageToDelete);
  };

  const handlePostImage = (imagesData: FormData) => {
    setShowModal(initialModalState);
    postPictureHttpRequest(imagesData);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (alertStatut.show) {
      timer = setTimeout(() => {
        setAlertStatut((prevState) => ({ ...prevState, show: false }));
      }, 4000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [alertStatut.show]);

  // delete picture request handling
  useEffect(() => {
    if (deletePictureStatut) {
      handleHTTPState(deletePictureStatut, deletePictureRequestError ?? "");
    }
  }, [deletePictureStatut, deletePictureRequestError, handleHTTPState]);

  // add picture request handling
  useEffect(() => {
    if (postPictureStatut) {
      handleHTTPState(postPictureStatut, postPictureRequestError ?? "");
    }
  }, [handleHTTPState, postPictureStatut, postPictureRequestError]);

  // shelters request loading handling
  useEffect(() => {
    handleHTTPState(getPictureStatut, getPictureRequestError ?? "");
  }, [getPictureStatut, getPictureRequestError, handleHTTPState]);

  // refresh pictures display on the screen
  useEffect(() => {
    getPictureRequestData && setSheltersData(getPictureRequestData);
  }, [getPictureRequestData]);

  useEffect(() => {
    deletePictureRequestData && setSheltersData(deletePictureRequestData);
  }, [deletePictureRequestData]);

  useEffect(() => {
    postPictureRequestData && setSheltersData(postPictureRequestData);
  }, [postPictureRequestData]);

  useEffect(() => {
    getPictureHttpRequest();
  }, [getPictureHttpRequest]);

  useEffect(() => {
    getCSRFttpRequest();
  }, [getCSRFttpRequest]);

  if (getPictureStatut === HTTPStateKind.PENDING) {
    return <p className="text-center">Chargement des images...</p>;
  }

  return (
    <section>
      <Modal
        show={showModal.show}
        onHide={() => {
          setShowModal(initialModalState);
        }}
      >
        <>
          {showModal.crop && urlFile ? (
            <CropContent
              shelterId={urlFile.id}
              url={urlFile.file}
              onImagePost={handlePostImage}
            />
          ) : null}
          {showModal.deleteAlert ? (
            <div>
              <h3>Suppression de l'image</h3>
              <p>Etes-vous sûr de vouloir supprimer cette image ?</p>
              <div className="button-container">
                <button className="button" onClick={handleDeleteImage}>
                  Oui
                </button>
                <button
                  className="button button--alt"
                  onClick={(event) => handleDeleteAlert(event, false)}
                >
                  Non
                </button>
              </div>
            </div>
          ) : null}
        </>
      </Modal>
      {sheltersData && sheltersData.length > 0 ? (
        <ul>
          {sheltersData.map((data) => (
            <li key={data._id}>
              <GalleryItem
                id={data._id}
                title={data.title}
                images={data.images}
                onSetUrlFile={setUrlFile}
                onImageDelete={(event) => handleDeleteAlert(event, true)}
                setShowModal={setShowModal}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">Aucune image à afficher.</p>
      )}
    </section>
  );
};

export default Gallery;
