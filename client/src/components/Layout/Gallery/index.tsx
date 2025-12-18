import styles from "./style.module.css";
import React, { useEffect, useState } from "react";
import { useMyQuery, useMyMutation } from "../../../hooks/use-query";
import {
  deletePictureRequest,
  getCSRF,
  getSheltersWithPicturesRequest,
  postPictureRequest,
  setMainPictureRequest,
} from "../../../lib/api";
import Modal from "../../UI/Modal";
import CropContent from "../CropContent";
import useHTTPState from "../../../hooks/use-http-state";
import GalleryItem from "../GalleryItem";
import { ShelterType } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next"; // <-- import i18n

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

const Gallery: React.FC = () => {
  const handleHTTPState = useHTTPState();
  const queryClient = useQueryClient();
  const { t } = useTranslation(); // <-- hook i18n

  useMyQuery({
    queryKey: ["csrf"],
    queryFn: getCSRF,
  });

  const {
    data: sheltersData,
    status: sheltersStatus,
    error: sheltersQueryError,
    isPending: sheltersIsPending,
  } = useMyQuery({
    queryKey: ["sheltersWithPictures"],
    queryFn: getSheltersWithPicturesRequest,
  });

  const { isPending: sheltersIsPendingMutation, mutate: postPictureMutate } =
    useMyMutation({
      queryKeys: ["sheltersWithPictures"],
      mutationFn: postPictureRequest,
      onSuccessFn: (newData) => {
        queryClient.invalidateQueries({ queryKey: ["shelters"] });
        queryClient.setQueryData(["sheltersWithPictures"], newData);
        handleHTTPState("success", t("gallery.imageAdded"));
      },
      onErrorFn: (_error, errorMessage) => {
        handleHTTPState("error", errorMessage);
      },
    });

  const { isPending: deletePictureIsPending, mutate: deletePictureMutate } =
    useMyMutation({
      queryKeys: ["sheltersWithPictures"],
      mutationFn: deletePictureRequest,
      onSuccessFn: (newData) => {
        queryClient.invalidateQueries({ queryKey: ["shelters"] });
        queryClient.setQueryData(["sheltersWithPictures"], newData);
        handleHTTPState("success", t("gallery.imageDeleted"));
      },
      onErrorFn: (_error, errorMessage) => {
        handleHTTPState("error", errorMessage);
      },
    });

  const { mutate: mainPictureMutate } = useMyMutation({
    queryKeys: ["sheltersWithPictures"],
    mutationFn: setMainPictureRequest,
    onMutate: async ({ shelterId, mainImgId }) => {
      await queryClient.cancelQueries({ queryKey: ["sheltersWithPictures"] });
      const previousData = queryClient.getQueryData<ShelterType[]>([
        "sheltersWithPictures",
      ]);
      queryClient.setQueryData<ShelterType[]>(
        ["sheltersWithPictures"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((item) =>
            item._id === shelterId
              ? { ...item, main_image_id: mainImgId }
              : item
          );
        }
      );
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelters"] });
    },
    onError: (_error, _variables, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["sheltersWithPictures"],
          context.previousData
        );
      }
      handleHTTPState("error", t("gallery.mainImageError"));
    },
  });

  const [imageToDelete, setImageToDelete] = useState("");
  const [urlFile, setUrlFile] = useState<{ id: string; file: string } | null>(
    null
  );
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

  const handleMainImageSet = (
    event: React.MouseEvent<HTMLButtonElement>,
    shelterId: string
  ) => {
    event.preventDefault();
    mainPictureMutate({
      shelterId,
      mainImgId: event.currentTarget.dataset.imageId!,
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

  useEffect(() => {
    handleHTTPState(
      sheltersStatus,
      sheltersStatus === "error" ? t("gallery.loadError") : ""
    );
  }, [sheltersStatus, sheltersQueryError, handleHTTPState, t]);

  useEffect(() => {
    if (
      sheltersIsPendingMutation ||
      sheltersIsPending ||
      deletePictureIsPending
    ) {
      handleHTTPState("pending");
    }
  }, [
    sheltersIsPendingMutation,
    sheltersIsPending,
    deletePictureIsPending,
    handleHTTPState,
  ]);

  if (sheltersIsPending) {
    return (
      <section>
        <p className="text-center">{t("gallery.loading")}</p>
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
            <div className={styles["delete-container"]}>
              <h3>{t("gallery.deleteTitle")}</h3>
              <p>{t("gallery.deleteMessage")}</p>
              <div className="button-container">
                <button className="button" onClick={handleDeleteImage}>
                  {t("gallery.yes")}
                </button>
                <button
                  className="button button--alt"
                  onClick={(event) => handleDeleteAlert(event, false)}
                >
                  {t("gallery.no")}
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
                mainImgId={data.main_image_id}
                title={data.title}
                images={data.images}
                onSetUrlFile={setUrlFile}
                isPending={sheltersIsPendingMutation || deletePictureIsPending}
                onImageDelete={(event) => handleDeleteAlert(event, true)}
                onMainImageSet={(event) => handleMainImageSet(event, data._id)}
                setShowModal={setShowModal}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">{t("gallery.noImage")}</p>
      )}
    </section>
  );
};

export default Gallery;
