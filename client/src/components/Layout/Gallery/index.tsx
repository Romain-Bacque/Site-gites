import React, { useEffect, useState, useRef, useCallback } from "react";
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
let slidesPerView = 1;
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
  const [imagesList, setImagesList] = useState<ImagesData>(shelterImages);
  const [urlFile, setUrlFile] = useState<string>("");
  const [showModal, setShowModal] = useState(initialModalState);
  const [alertStatut, setAlertStatut] =
    useState<AlertStatut>(initialMessageState);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
  });
  const imageRef = useRef<HTMLButtonElement>(null);
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const dispatch = useAppDispatch();

  const handleDeleteAlert = (value: boolean) => {
    setShowModal({
      show: value,
      crop: false,
      deleteAlert: true,
    });
  };

  const handleDeleteImage = () => {
    setShowModal(initialModalState);

    const imageId = imageRef.current?.dataset.imageId;

    imageId && deletePictureHttpRequest(imageId);
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

  if (dimensions.width < 600) {
    slidesPerView = 1;
  } else if (dimensions.width > 600 && dimensions.width < 1250) {
    slidesPerView = 2;
  } else slidesPerView = 3;

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
  }, [
    dispatch,
    deletePictureStatut,
    deletePictureRequestError,
  ]);

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
              <h3>Suppréssion de l'image</h3>
              <p>Etes-vous sûr de vouloir supprimer cette image ?</p>
              <div className="button-container">
                <button className="button" onClick={handleDeleteImage}>
                  Oui
                </button>
                <button
                  className="button button--alt"
                  onClick={handleDeleteAlert.bind(null, false)}
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
          {isAuth ? (
            <div className="button-container button-container--alt">
              <h3>Photos Gîte Flo</h3>
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
            </div>
          ) : null}
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            centeredSlides={true}
            slidesPerView={slidesPerView}
            navigation
            pagination={{ clickable: true }}
            className={classes.swiper}
          >
            {imagesList?.length > 0 ? (
              imagesList.map((image) => (
                <SwiperSlide key={image._id} className={classes.swiper__slide}>
                  {isAuth && (
                    <button
                      ref={imageRef}
                      data-image-id={image._id}
                      onClick={handleDeleteAlert.bind(null, true)}
                      className={classes.swiper__icon}
                      title="Supprimer l'image"
                    >
                      <FontAwesomeIcon
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
