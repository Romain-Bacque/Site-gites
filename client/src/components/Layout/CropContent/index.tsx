import useHttp, { HTTPStateKind } from "../../../hooks/use-http";
import { useAppDispatch } from "../../../hooks/use-store";
import React, { MouseEventHandler, useCallback, useEffect, useState } from "react";

import { postPictureRequest } from "../../../lib/api";
import Cropper, { Area } from "react-easy-crop";
import classes from "./style.module.css";
import getCroppedImg from "./lib/cropImage";
// types import
import { CropContentProps } from "./types";
import { loadingActions } from "../../../store/loading";

let cropDatas: [string, Area];

// component
const CropContent: React.FC<CropContentProps> = ({
  shelterNumber,
  url,
  getImagesList,
  onServerResponse,
}) => {
  const {
    sendHttpRequest: postPictureHttpRequest,
    statut: postPictureStatut,
    data: imagesData,
  } = useHttp(postPictureRequest);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const dispatch = useAppDispatch();

  const handleCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      cropDatas = [url, croppedAreaPixels];
    },
    [url]
  );

  useEffect(() => {
    if(postPictureStatut) {
      dispatch(loadingActions.setStatut(postPictureStatut))
      dispatch(loadingActions.setMessage({
        success: null,
        error: null
      }))
      onServerResponse(postPictureStatut);    
    }
    if (postPictureStatut === HTTPStateKind.SUCCESS && imagesData) {
      getImagesList(imagesData);
    }
  }, [postPictureStatut])

  const handleCropImage: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const file = await getCroppedImg(cropDatas[0], cropDatas[1]);

        const formData = new FormData();
        formData.append("shelterNumber", shelterNumber.toString());
        formData.append("file", file!);

        postPictureHttpRequest(formData);
      } catch (err) {
        console.trace(err);
      }
    },
    [postPictureHttpRequest, shelterNumber]
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
          <span className={classes["crop-container__span"]}>-</span>
          <input
            className={classes["crop-container__input"]}
            type="range"
            min={1}
            max={10}
            step={0.1}
            value={zoom}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setZoom(+event.target.value)
            }
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
