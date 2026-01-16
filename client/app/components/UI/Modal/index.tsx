"use client";

import { memo } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import classes from "./style.module.css";
import { ModalProps } from "./types";
import clsx from "clsx";

const backdropAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalAnimation = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

const Modal: React.FC<ModalProps> = ({ show, onHide, children, className }) => {
  if (typeof document === "undefined") return null;

  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");

  if (!backdropRoot || !overlayRoot) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {ReactDOM.createPortal(
            <motion.div
              className={classes.backdrop}
              onClick={onHide}
              variants={backdropAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
            />,
            backdropRoot,
          )}

          {ReactDOM.createPortal(
            <motion.div
              className={clsx(classes.modal, className)}
              variants={modalAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ x: "-50%", y: "-25%" }}
            >
              <button
                className={classes["close-button"]}
                onClick={onHide}
                aria-label="Fermer la modale"
              >
                <FontAwesomeIcon icon={faClose} />
              </button>

              {children}
            </motion.div>,
            overlayRoot,
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(Modal);
