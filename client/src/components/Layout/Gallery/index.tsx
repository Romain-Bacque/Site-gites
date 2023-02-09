import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/use-store";
import useHttp from "../../../hooks/use-http";

import { deletePictureRequest, postPictureRequest } from "../../../lib/api";
import classes from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../UI/Modal";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import CropContent from "../CropContent";
import { loadingActions } from "../../../store/loading";
// types import
import { AlertStatut, GalleryProps, ImagesData } from "./types";
import { HandleLoading } from "../../../global/types";
import Card from "../../UI/Card";

// variable & constante
const initialModalState = {
    show: false,
    crop: false,
    deleteAlert: false,
  },
  initialMessageState = {
    message: null,
    alert: null,
    show: false,
  };

// component
const Gallery: React.FC<GalleryProps> = ({
  shelterId,
  shelterTitle,
  imagesData: shelterImages,
}) => {
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
  const [imagesList, setImagesList] = useState<ImagesData>(shelterImages);
  const [urlFile, setUrlFile] = useState("");
  const [showModal, setShowModal] = useState(initialModalState);
  const [alertStatut, setAlertStatut] =
    useState<AlertStatut>(initialMessageState);
  const [_, setDimensions] = useState({
    width: window.innerWidth,
  });
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const dispatch = useAppDispatch();

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

  const handleFileValueChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.files && event.target.files[0]) {
      setUrlFile(URL.createObjectURL(event.target.files[0]));
      event.target.value = "";
      setShowModal({
        show: true,
        crop: true,
        deleteAlert: false,
      });
    }
  };

  const handleLoading: HandleLoading = useCallback(
    (statut, success, error) => {
      dispatch(loadingActions.setStatut(statut));
      dispatch(
        loadingActions.setMessage({
          success,
          error,
        })
      );
    },
    [dispatch]
  );

  // refresh pictures display on the screen
  useEffect(() => {
    deletePictureRequestData && setImagesList(deletePictureRequestData);
  }, [deletePictureRequestData]);

  useEffect(() => {
    postPictureRequestData && setImagesList(postPictureRequestData);
  }, [postPictureRequestData]);

  // delete picture request handling
  useEffect(() => {
    if (deletePictureStatut) {
      handleLoading(
        deletePictureStatut,
        "Image supprimé.",
        deletePictureRequestError
      );
    }
  }, [deletePictureStatut, deletePictureRequestError, handleLoading]);

  // add picture request handling
  useEffect(() => {
    if (postPictureStatut) {
      handleLoading(
        postPictureStatut,
        "Image ajouté.",
        postPictureRequestError
      );
    }
  }, [handleLoading, postPictureStatut, postPictureRequestError]);

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
      });
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  // delete picture request loading handling
  useEffect(() => {
    if (deletePictureStatut) {
      dispatch(loadingActions.setStatut(deletePictureStatut));
      dispatch(
        loadingActions.setMessage({
          success: "Image supprimé avec succés.",
          error: deletePictureRequestError,
        })
      );
    }
    dispatch(loadingActions.setStatut(deletePictureStatut));
  }, [dispatch, deletePictureStatut, deletePictureRequestError]);

  // add picture request loading handling
  useEffect(() => {
    if (postPictureStatut) {
      dispatch(loadingActions.setStatut(postPictureStatut));
      dispatch(
        loadingActions.setMessage({
          success: "Image ajouté avec succés.",
          error: null,
        })
      );
    }
  }, [dispatch, postPictureStatut]);

  return (
    <>
      <Modal
        show={showModal.show}
        onHide={() => {
          setShowModal(initialModalState);
        }}
      >
        <>
          {showModal.crop ? (
            <CropContent
              shelterId={shelterId}
              onImagePost={handlePostImage}
              url={urlFile}
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
      <Card>
        <>
          <div className="button-container button-container--alt">
            <h3
              className={classes["album-title"]}
            >{`Photos ${shelterTitle}`}</h3>
            {isAuth ? (
              <div>
                <label
                  htmlFor={`files-shelter${shelterTitle}`}
                  className="button button--alt"
                >
                  Ajouter une photo
                  <FontAwesomeIcon className="button__icon" icon={faAdd} />
                </label>
                <input
                  id={`files-shelter${shelterTitle}`}
                  style={{ display: "none" }}
                  type="file"
                  name="file"
                  onChange={handleFileValueChange}
                  accept="image/*"
                />
              </div>
            ) : null}
          </div>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            centeredSlides
            slidesPerView="auto"
            navigation
            pagination={{ clickable: true }}
            className={classes.swiper}
          >
            {imagesList?.length > 0 ? (
              imagesList.map((image) => (
                <SwiperSlide key={image._id} className={classes.swiper__slide}>
                  {isAuth && (
                    <button
                      data-image-id={image._id}
                      onClick={(event) => handleDeleteAlert(event, true)}
                      className={classes.swiper__icon}
                      title="Supprimer l'image"
                    >
                      <FontAwesomeIcon
                        className={classes["delete-icon"]}
                        style={{ pointerEvents: "none" }}
                        icon={faTrash}
                      />
                    </button>
                  )}
                  <img
                    className={classes.image}
                    alt={image.filename}
                    src={image.url}
                  />
                </SwiperSlide>
              ))
            ) : (
              <p>Il n'y a aucune image.</p>
            )}
            <p className="space" />
          </Swiper>
        </>
      </Card>
    </>
  );
};

export default Gallery;
