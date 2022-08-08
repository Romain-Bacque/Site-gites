import { useCallback, useState } from "react";
import useHttp from "../../../hooks/use-http";

import { postPictureRequest } from "../../../lib/api";
import Cropper from "react-easy-crop";
import Loader from "../Loader";
import classes from "./CropContent.module.css";
import getCroppedImg from "./lib/cropImage";

const CropContent = ({ shelterNumber, url, getImagesList }) => {
  const {
    sendHttpRequest: postPictureHttpRequest,
    statut: postPictureStatut,
    data: imagesData,
  } = useHttp(postPictureRequest);
  const [cropDatas, setCropDatas] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(
    (_, croppedAreaPixels) => {
      setCropDatas([url, croppedAreaPixels]);
    },
    [url]
  );

  const handleCropImage = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const file = await getCroppedImg(...cropDatas);

        const formData = new FormData();
        formData.append("shelterNumber", shelterNumber);
        formData.append("file", file);

        postPictureHttpRequest(formData);
      } catch (err) {
        console.trace(err);
      }
    },
    [cropDatas, postPictureHttpRequest, shelterNumber]
  );

  return (
    <div
      className={classes["crop-container"]}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={classes["crop-container__cropper"]}>
        <Cropper
          image={url}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <form className={classes["crop-container__form"]}>
        <div>
          {postPictureStatut && (
            <Loader
              statut={postPictureStatut}
              onSuccess={() => getImagesList(imagesData)}
              message={{
                success: "Enregistrement réussi.",
                error: "Enregistrement impossible.",
              }}
            />
          )}
          <span className={classes["crop-container__span"]}>-</span>
          <input
            className={classes["crop-container__input"]}
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={zoom}
            onChange={(event) => setZoom(event.target.value)}
          />
          <span className={classes["crop-container__span"]}>+</span>
        </div>
        <button
          type="button"
          onClick={handleCropImage}
          className={classes["crop-container__button"]}
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default CropContent;
