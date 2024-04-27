import { useDispatch } from "react-redux";
import { loadingActions } from "../store/loading";
import { useCallback, useEffect } from "react";
import { HTTPStateKind } from "../global/types";

// type aliases
export type HandleLoading = (
  statut: HTTPStateKind | null | undefined,
  pendingMessage: string | null,
  successMessage: string | null,
  errorMessage: string | null
) => void;

const useLoading = () => {
  const dispatch = useDispatch();

  const resetLoadingStatus = useCallback(
    () => dispatch(loadingActions.reset()),
    [dispatch]
  );

  const handleLoading: HandleLoading = useCallback(
    (statut, pendingMessage, successMessage, errorMessage) => {
      if (!statut || statut === HTTPStateKind.IDLE) return;

      dispatch(loadingActions.setStatut(statut));
      dispatch(
        loadingActions.setMessage({
          pending: pendingMessage,
          success: successMessage,
          error: errorMessage,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    return () => {
      resetLoadingStatus();
    };
  }, [resetLoadingStatus]);

  return handleLoading;
};

export default useLoading;
