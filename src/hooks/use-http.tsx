import { useReducer, useCallback } from "react";
import { getShelters } from "../lib/api";

enum HTTPStateKind {
  SEND,
  SUCCESS,
  ERROR,
}

type httpRequestType = (arg?: object | number) => Promise<void | object[]>;

type Unpromisify<T> = T extends Promise<infer ReturnType> ? ReturnType : T;

interface HTTPState {
  statut: null | string;
  data: null | object[];
  error: null | string;
}

interface HTTPAction {
  type: HTTPStateKind;
  value?: null | string | object[];
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

        const responseData = (await httpRequest(requestData)) as Awaited<
          ReturnType<typeof httpRequest>
        >;

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
