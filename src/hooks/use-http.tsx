import { useReducer, useCallback } from "react";

enum HTTPStateKind {
  SEND,
  SUCCESS,
  ERROR,
}

type StatutAndErrorType = null | string;
type ValueAndDataType = null | string | number | object[];

type httpRequestType = (
  arg?: object | number
) => Promise<void | object[] | number>;

interface HTTPState {
  statut: StatutAndErrorType;
  data: ValueAndDataType;
  error: StatutAndErrorType;
}
interface HTTPAction {
  type: HTTPStateKind;
  value?: ValueAndDataType;
}

const initialState = {
  statut: null,
  data: null,
  error: null,
};

function httpReducer(state: HTTPState, action: HTTPAction): HTTPState {
  const { type, value } = action;

  switch (type) {
    case HTTPStateKind.SEND:
      return {
        statut: "send",
        data: null,
        error: null,
      };
    case HTTPStateKind.SUCCESS:
      return {
        statut: "success",
        data: (value as object[]) || null,
        error: null,
      };
    case HTTPStateKind.ERROR:
      return {
        statut: "error",
        data: null,
        error: value!.toString(),
      };
    default:
      return state;
  }
}

function useHttp<T extends httpRequestType>(httpRequest: T) {
  const [httpState, dispatch] = useReducer(httpReducer, initialState);

  const sendHttpRequest = useCallback(
    async <D extends object | number>(requestData?: D) => {
      try {
        dispatch({ type: HTTPStateKind.SEND });

        const responseData = await httpRequest(requestData);

        dispatch({ type: HTTPStateKind.SUCCESS, value: responseData ?? null });
      } catch (err) {
        dispatch({
          type: HTTPStateKind.ERROR,
          value: (err as string) || "Une erreur s'est produit !",
        });
      }
    },
    [httpRequest]
  );

  return {
    sendHttpRequest,
    ...httpState,
  };
}

export default useHttp;
