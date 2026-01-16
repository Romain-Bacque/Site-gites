import { useDispatch } from "react-redux";
import { loadingActions } from "../store/loading";
import { useCallback, useEffect } from "react";
import { HTTPStateKind } from "../global/types";

// type aliases
export type HandleHTTPState = (
  statut: HTTPStateKind | null | undefined,
  message?: string
) => void;

const useHTTPState = (): HandleHTTPState => {
  const dispatch = useDispatch();

  const handleHTTPState = useCallback<HandleHTTPState>(
    (statut, message = "") => {
      if (!statut || statut === "idle") {
        dispatch(loadingActions.reset());
        return;
      }

      dispatch(loadingActions.setStatut(statut));
      dispatch(loadingActions.setMessage(message));
    },
    [dispatch]
  );

  useEffect(() => {
    return () => {
      dispatch(loadingActions.reset());
    };
  }, [dispatch]);

  return handleHTTPState;
};

export default useHTTPState;
