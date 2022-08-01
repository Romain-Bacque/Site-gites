import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import classes from "./CropContent.module.css";
import getCroppedImg from "./lib/cropImage";

const cropDatas = [];

const CropContent = ({ url, onAddPicture }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback(
    (_, croppedAreaPixels) => {
      cropDatas.push(url);
      cropDatas.push(croppedAreaPixels);
    },
    [url]
  );

  const handleCropImage = useCallback(async (event) => {
    event.preventDefault();

    try {
      const { file, url } = await getCroppedImg(...cropDatas);

      onAddPicture(file, url);
    } catch (err) {
      console.trace(err);
    }
  });

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
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <form className={classes["crop-container__form"]}>
        <div>
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
          onClick={handleCropImage}
          className={classes["crop-container__button"]}
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default CropContent;
