import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import useHttp from "../../hooks/use-http";

import { deletePictureRequest } from "../../lib/api";
import classes from "./Gallery.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../UI/Modal";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import CropContent from "./crop/CropContent";
import Loader from "./Loader";
import Alert from "../UI/Alert";

let slidesPerView = 1;

const Gallery = ({ imagesData: shelterImages, shelter }) => {
  const {
    sendHttpRequest: deletePictureHttpRequest,
    statut: deletePictureStatut,
    data: imagesData,
  } = useHttp(deletePictureRequest);
  const [imagesList, setImagesList] = useState(shelterImages);
  const [urlFile, setUrlFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [statutMessage, setStatutMessage] = useState({
    message: null,
    alert: null,
    show: false,
  });
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
  });
  const imageRef = useRef();
  const isAuth = useSelector((state) => state.auth.isAuthentificated);

  const handleDeleteAlert = (value, event) => {
    imageRef.current = event.target.dataset.imageId;

    setShowModal({
      show: value,
      crop: false,
      deleteAlert: true,
    });
  };

  const handleDeleteImage = () => {
    setShowModal({
      show: false,
      crop: false,
      deleteAlert: false,
    });
    setShowLoader(true);

    deletePictureHttpRequest(imageRef.current);
  };

  const handleFileValueChange = (event) => {
    if (event.target.files[0]) {
      setUrlFile(URL.createObjectURL(event.target.files[0]));
      event.target.value = null;
      setShowModal({
        show: true,
        crop: true,
        deleteAlert: false,
      });
    }
  };

  const handleAddError = () => {
    setStatutMessage({
      message: "Echec enregistrement",
      alert: "error",
      show: true,
    });

    setShowModal((prevState) => ({ ...prevState, show: false }));
  };

  const handleRequestEnd = useCallback(
    (statut) => {
      if (statut === "success") {
        const filteredImagesData = imagesData.filter(
          (image) => parseInt(shelter) === parseInt(image.shelter?.number)
        );

        setStatutMessage({
          message: "Image supprimé",
          alert: "information",
          show: true,
        });
        setImagesList(filteredImagesData);
      } else if (statut === "error") {
        setStatutMessage({
          message: "Echec suppression",
          alert: "error",
          show: true,
        });
      }
      setShowLoader(false);
    },
    [imagesData, shelter]
  );

  const handleImagesList = (updatedList) => {
    setImagesList(updatedList);
    setShowModal((prevState) => ({ ...prevState, show: false }));
  };

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
    let timer;

    if (statutMessage.show) {
      timer = setTimeout(() => {
        setStatutMessage((prevState) => ({ ...prevState, show: false }));
      }, 4000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [statutMessage.show]);

  return (
    <>
      {showLoader && (
        <Loader
          statut={deletePictureStatut}
          onRequestEnd={handleRequestEnd}
          message={{
            success: "Suppression réussi.",
            error: "Suppression impossible.",
          }}
        />
      )}
      <Modal
        show={showModal.show}
        onHide={() => {
          setShowModal((prevState) => ({ ...prevState, show: false }));
        }}
      >
        {showModal.crop && (
          <CropContent
            onError={handleAddError}
            getImagesList={handleImagesList}
            shelterNumber={shelter}
            url={urlFile}
          />
        )}
        {showModal.deleteAlert && (
          <div>
            <p>Etes-vous sûr de vouloir supprimer cette image ?</p>
            <div>
              <button onClick={handleDeleteImage}>Oui</button>
              <button onClick={handleDeleteAlert.bind(null, false)}>Non</button>
            </div>
          </div>
        )}
      </Modal>
      {isAuth && (
        <>
          <Alert
            message={statutMessage.message}
            alert={statutMessage.alert}
            show={statutMessage.show}
          />
          <div>
            <label
              htmlFor={`files-shelter${shelter}`}
              className={classes["file-button"]}
            >
              Ajouter une photo
            </label>
            <input
              id={`files-shelter${shelter}`}
              style={{ visibility: "hidden" }}
              type="file"
              name="file"
              onChange={handleFileValueChange}
              accept="image/*"
            />
          </div>
        </>
      )}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={slidesPerView}
        navigation
        pagination={{ clickable: true }}
        className={classes.swiper}
      >
        {imagesList && imagesList.length ? (
          imagesList.map((image) => (
            <SwiperSlide key={image._id} className={classes.swiper__slide}>
              {isAuth && (
                <div
                  data-image-id={image._id}
                  onClick={handleDeleteAlert.bind(null, true)}
                  className={classes.swiper__icon}
                  title="Supprimer l'image"
                >
                  <FontAwesomeIcon
                    style={{ pointerEvents: "none" }}
                    icon={faTrash}
                  />
                </div>
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
  );
};

export default Gallery;
