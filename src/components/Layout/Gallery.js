import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useHttp from "../../hooks/use-http";

import { getPictureRequest } from "../../lib/api";
import classes from "./Gallery.module.css";
import image from "../../img/gite1_large.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrashCan,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../UI/Modal";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import CropContent from "./crop/CropContent";
import Loader from "./Loader";

//variable qui stocke le nombre de slides par gite qui s'affiche à l'écran
let slidesPerView = 1;

const Gallery = () => {
  const {
    sendHttpRequest: getPictureHttpRequest,
    statut: getPictureStatut,
    data: imagesData,
  } = useHttp(getPictureRequest);
  const fileInputRef = useRef();
  const [imagesList, setImagesList] = useState([]);
  const [urlFile, setUrlFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
  });
  const isAuth = useSelector((state) => state.auth.isAuthentificated);

  const handleHideBubble = useCallback(() => {
    if (showBubble) {
      setShowBubble(false);
    }
  }, [showBubble]);

  const handleBubbleShow = (event) => {
    event.stopPropagation();
    setShowBubble((prevShowBubble) => !prevShowBubble);
  };

  const handleFileValueChange = (event) => {
    if (event.target.files[0]) {
      setUrlFile(URL.createObjectURL(event.target.files[0]));
      event.target.value = null;
      setShowModal(true);
    }
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

  useEffect(() => {
    window.addEventListener("click", handleHideBubble);

    return () => {
      window.removeEventListener("click", handleHideBubble);
    };
  }, [handleHideBubble]);

  useEffect(() => {
    getPictureHttpRequest();
  }, [getPictureHttpRequest]);

  if (dimensions.width < 600) {
    slidesPerView = 1;
  } else if (dimensions.width > 600 && dimensions.width < 1250) {
    slidesPerView = 2;
  } else slidesPerView = 3;
  console.log(imagesList);
  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        {
          <CropContent
            getImagesList={() => setImagesList(imagesData)}
            shelterNumber="0"
            url={urlFile}
          />
        }
      </Modal>
      {isAuth && (
        <div>
          <label htmlFor="files" className={classes["file-button"]}>
            Choisir une photo
          </label>
          <input
            id="files"
            style={{ visibility: "hidden" }}
            type="file"
            name="file"
            ref={fileInputRef}
            onChange={handleFileValueChange}
            accept="image/*"
          />
        </div>
      )}
      {getPictureStatut && (
        <Loader
          statut={getPictureStatut}
          onSuccess={(data) => setImagesList(data)}
          message={{
            success: null,
            error: "Affichage des images impossible.",
          }}
        />
      )}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={slidesPerView}
        navigation
        pagination={{ clickable: true }}
        className={classes.swiper}
      >
        {imagesList &&
          imagesList.map((image) => {
            <SwiperSlide ref={image._id} className={classes.swiper__slide}>
              {isAuth && showBubble && (
                <div
                  onClick={(event) => event.stopPropagation()}
                  className={classes.bubble}
                >
                  <button className={classes.bubble__button}>
                    <FontAwesomeIcon
                      className={classes.bubble__icon}
                      icon={faTrashCan}
                    />
                    Supprimer la photo
                  </button>
                  <button className={classes.bubble__button}>
                    <FontAwesomeIcon
                      className={classes.bubble__icon}
                      icon={faPenToSquare}
                    />
                    Modifier la photo
                  </button>
                </div>
              )}
              {isAuth && (
                <FontAwesomeIcon
                  onClick={handleBubbleShow}
                  className={classes.swiper__icon}
                  icon={faPen}
                />
              )}
              <img className={classes.image} alt="image" src={image.url} />
            </SwiperSlide>;
          })}
        <SwiperSlide>
          <img className={classes.image} alt="image" src={image} />
        </SwiperSlide>
        <SwiperSlide>
          <img className={classes.image} alt="image" src={image} />
        </SwiperSlide>
        <SwiperSlide>
          <img className={classes.image} alt="image" src={image} />
        </SwiperSlide>
        <p className="space" />
      </Swiper>
    </>
  );
};

export default Gallery;
