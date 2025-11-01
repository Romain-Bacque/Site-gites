import React, { useEffect, useState } from "react";
import { useMyQuery, useMyMutation } from "../../../hooks/use-query";
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
  const handleHTTPState = useHTTPState();

  // queries
  useMyQuery({
    queryKey: ["csrf"],
    queryFn: getCSRF,
  });

  const {
    data: sheltersQueryData,
    status: sheltersStatus,
    error: sheltersQueryError,
    isPending: sheltersIsPending,
  } = useMyQuery({
    queryKey: ["sheltersWithPictures"],
    queryFn: getSheltersWithPicturesRequest,
  });

  // mutations
  const {
    mutate: postPictureMutate,
    status: postPictureStatus,
    error: postPictureError,
  } = useMyMutation({
    mutationFn: postPictureRequest,
    onSuccessFn: (data) => {
      data && setSheltersData(data);
      handleHTTPState("success", "Image ajoutée avec succès.");
    },
    onErrorFn: (_error, errorMessage) => {
      handleHTTPState("error", errorMessage);
    },
  });

  const {
    mutate: deletePictureMutate,
    status: deletePictureStatus,
    error: deletePictureError,
  } = useMyMutation({
    mutationFn: deletePictureRequest,
    onSuccessFn: (data) => {
      data && setSheltersData(data);
      handleHTTPState("success", "Image supprimée avec succès.");
    },
    onErrorFn: (_error, errorMessage) => {
      handleHTTPState("error", errorMessage);
    },
  });

  const [imageToDelete, setImageToDelete] = useState("");
  const [urlFile, setUrlFile] = useState<{ id: string; file: string } | null>(
    null
  );
  const [sheltersData, setSheltersData] = useState<ShelterType[] | null>(null);
  const [showModal, setShowModal] = useState(initialModalState);
  const [alertStatut, setAlertStatut] = useState(initialMessageState);

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
    imageToDelete && deletePictureMutate(imageToDelete);
  };

  const handlePostImage = (imagesData: FormData) => {
    setShowModal(initialModalState);
    postPictureMutate(imagesData);
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

  // handle HTTP state for queries/mutations (useMyQuery already calls useHTTPState for queries;
  // keep handling for mutations and any errors from queries if needed)
  useEffect(() => {
    handleHTTPState(
      sheltersStatus,
      sheltersStatus === "error" ? "Erreur lors du chargement des images." : ""
    );
  }, [sheltersStatus, sheltersQueryError, handleHTTPState]);

  // refresh pictures display on the screen
  useEffect(() => {
    sheltersQueryData && setSheltersData(sheltersQueryData);
  }, [sheltersQueryData]);

  if (sheltersIsPending) {
    return (
      <section>
        <p className="text-center">Chargement des images...</p>
      </section>
    );
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
        <p className="text-center">Aucune image disponible.</p>
      )}
    </section>
  );
};

export default Gallery;
