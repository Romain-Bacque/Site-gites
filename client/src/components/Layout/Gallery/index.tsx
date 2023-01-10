import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAppSelector } from "../../../hooks/use-store";
import useHttp, { HTTPStateKind } from "../../../hooks/use-http";

import { deletePictureRequest } from "../../../lib/api";
import classes from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../UI/Modal";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import CropContent from "../CropContent";
import Loader from "../Loader";
import Alert, { AlertKind } from "../../UI/Alert";

// interfaces
interface StatutMessage {
  message: null | string;
  alert: null | AlertKind;
  show: boolean;
}
interface GalleryProps {
  imagesData: {
    _id: string;
    url: string;
    filename: string;
    shelter_id: {
      number: number;
    };
  }[];
  shelterNumber: number;
}

// type aliases
type ImagesData = {
  _id: string;
  url: string;
  filename: string;
  shelter_id: {
    number: number;
  };
}[];

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
  imagesData: shelterImages,
  shelterNumber,
}) => {
  const {
    sendHttpRequest: deletePictureHttpRequest,
    statut: deletePictureStatut,
    data: imagesData,
  } = useHttp(deletePictureRequest);
  const [imagesList, setImagesList] = useState<ImagesData>(shelterImages);
  const [urlFile, setUrlFile] = useState<string>("");
  const [showModal, setShowModal] = useState(initialModalState);
  const [showLoader, setShowLoader] = useState(false);
  const [statutMessage, setStatutMessage] =
    useState<StatutMessage>(initialMessageState);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
  });
  const imageRef = useRef<HTMLButtonElement>(null);
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);

  const handleDeleteAlert = (value: boolean) => {
    setShowModal({
      show: value,
      crop: false,
      deleteAlert: true,
    });
  };

  const handleDeleteImage = () => {
    setShowModal(initialModalState);
    setShowLoader(true);

    const imageId = imageRef.current?.dataset.imageId;

    imageId && deletePictureHttpRequest(imageId);
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

  const handleCropRequestEnd = (statut: HTTPStateKind) => {
    if (statut === HTTPStateKind.SUCCESS) {
      setStatutMessage({
        message: "Photo ajouté",
        alert: AlertKind.INFO,
        show: true,
      });
    } else {
      setStatutMessage({
        message: "Echec ajout",
        alert: AlertKind.ERROR,
        show: true,
      });
    }

    setShowModal(initialModalState);
  };

  const handleRequestEnd = useCallback(
    (statut: HTTPStateKind) => {
      if (statut === HTTPStateKind.SUCCESS) {
        const filteredImagesData = imagesData
          ? imagesData.filter(
              (image) => shelterNumber === +image.shelter_id?.number
            )
          : [];

        setStatutMessage({
          message: "Image supprimé",
          alert: AlertKind.INFO,
          show: true,
        });
        setImagesList(filteredImagesData);
      } else if (statut === HTTPStateKind.ERROR) {
        setStatutMessage({
          message: "Echec suppression",
          alert: AlertKind.ERROR,
          show: true,
        });
      }
      setShowLoader(false);
    },
    [imagesData, shelterNumber]
  );

  const handleImagesList = (updatedList: ImagesData) => {
    setImagesList(updatedList);
    setShowModal(initialModalState);
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
    let timer: NodeJS.Timeout;

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
          setShowModal(initialModalState);
        }}
      >
        <>
          {showModal.crop ? (
            <CropContent
              onRequestEnd={handleCropRequestEnd}
              getImagesList={handleImagesList}
              shelterNumber={shelterNumber}
              url={urlFile}
            />
          ) : null}
          {showModal.deleteAlert ? (
            <div>
              <p>Etes-vous sûr de vouloir supprimer cette image ?</p>
              <div>
                <button onClick={handleDeleteImage}>Oui</button>
                <button onClick={handleDeleteAlert.bind(null, false)}>
                  Non
                </button>
              </div>
            </div>
          ) : null}
        </>
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
              htmlFor={`files-shelter${shelterNumber}`}
              className={classes["file-button"]}
            >
              Ajouter une photo
            </label>
            <input
              id={`files-shelter${shelterNumber}`}
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
  );
};

export default Gallery;
