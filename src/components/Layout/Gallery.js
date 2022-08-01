import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./Gallery.module.css";
import image from "../../img/gite1_large.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrashCan,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import CropModal from "./crop/CropModal";

//variable qui stocke le nombre de slides par gite qui s'affiche à l'écran
let slidesPerView = 1;

const Gallery = () => {
  const fileInputRef = useRef();
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
      setShowModal(true);
    }
  };

  const handleCropPicture = async () => {};

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);
  }, []);

  if (dimensions.width < 600) {
    slidesPerView = 1;
  } else if (dimensions.width > 600 && dimensions.width < 1250) {
    slidesPerView = 2;
  } else slidesPerView = 3;

  useEffect(() => {
    window.addEventListener("click", handleHideBubble);
  }, [handleHideBubble]);

  return (
    <>
      {showModal && (
        <CropModal
          onGetCropPicture={handleCropPicture}
          hideModal={() => setShowModal(false)}
          url={urlFile}
        />
      )}
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
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={slidesPerView}
        navigation
        pagination={{ clickable: true }}
        className={classes.swiper}
      >
        <SwiperSlide className={classes.swiper__slide}>
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
          <img className={classes.image} alt="image" src={image} />
        </SwiperSlide>
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
