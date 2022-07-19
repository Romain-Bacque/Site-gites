import { useReducer, useCallback } from "react";

const initialState = {
  statut: null,
  message: null,
  data: null,
  error: false,
};

const httpReducer = (state, action) => {
  if (action.type === "SEND") {
    return {
      statut: "send",
      data: null,
      error: false,
    };
  } else if (action.type === "SUCCESS") {
    return {
      statut: "success",
      data: action.value || null,
      error: false,
    };
  } else if (action.type === "ERROR") {
    return {
      statut: "error",
      data: null,
      error: action.value,
    };
  }

  return state;
};

const useHttp = (httpRequest) => {
  const [httpState, dispatch] = useReducer(httpReducer, initialState);

  const sendHttpRequest = useCallback(
    async (requestData) => {
      try {
        dispatch({ type: "SEND" });
        const responseData = await httpRequest(requestData);
        dispatch({ type: "SUCCESS", value: responseData || null });
      } catch (err) {
        dispatch({
          type: "ERROR",
          value: err.message || "Une erreur s'est produit !",
        });
      }
    },
    [httpRequest]
  );

  return {
    sendHttpRequest,
    ...httpState,
  };
};

export default useHttp;
