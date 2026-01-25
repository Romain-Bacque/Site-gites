/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Alert from "../Alert";
import { StatutMessage } from "./types";
import { useAppSelector } from "@/app/hooks/use-store";
import Loader from "../Loader";

const initialAlertState: StatutMessage = {
  message: "",
  alertKind: null,
  show: false,
};

export default function LoaderAndAlert() {
  const loading = useAppSelector((state) => state.loading);
  const [alertStatut, setAlertStatut] =
    useState<StatutMessage>(initialAlertState);

  useEffect(() => {
    if (
      (loading.statut === "success" || loading.statut === "error") &&
      loading.message
    ) {
      setAlertStatut({
        message: loading.message,
        alertKind: loading.statut,
        show: true,
      });
    }
  }, [loading.statut, loading.message]);

  useEffect(() => {
    if (!alertStatut.show) return;

    const timer = setTimeout(() => {
      setAlertStatut((prev) => ({ ...prev, show: false }));
    }, 4000);

    return () => clearTimeout(timer);
  }, [alertStatut.show]);

  return (
    <>
      {loading.statut === "pending" && <Loader />}
      <Alert
        message={alertStatut.message}
        alert={alertStatut.alertKind}
        show={alertStatut.show}
        onAlertClose={() =>
          setAlertStatut((prev) => ({ ...prev, show: false }))
        }
      />
    </>
  );
}
