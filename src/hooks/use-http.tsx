import axios from "axios";
import { useReducer, useCallback } from "react";

// enums
export enum HTTPStateKind {
  SEND,
  SUCCESS,
  ERROR,
}

// type aliases
export type StatutType = null | HTTPStateKind;
type HTTPRequestType = (arg: any) => Promise<any>;
type ErrorType = null | string;
type DataType<T> = T | null;

// interfaces
interface HTTPState<T> {
  statut: StatutType;
  data: DataType<T>;
  error: ErrorType;
}
interface HTTPAction<T> {
  type: HTTPStateKind;
  value?: DataType<T>;
  errorMessage?: string;
}

// variable & constante
const initialState = {
  statut: null,
  data: null,
  error: null,
};

// component
function httpReducer<T>(
  state: HTTPState<T>,
  action: HTTPAction<T>
): HTTPState<T> {
  const { type, value } = action;

  switch (type) {
    case HTTPStateKind.SEND:
      return {
        statut: HTTPStateKind.SEND,
        data: null,
        error: null,
      };
    case HTTPStateKind.SUCCESS:
      return {
        statut: HTTPStateKind.SUCCESS,
        data: value || null,
        error: null,
      };
    case HTTPStateKind.ERROR:
      return {
        statut: HTTPStateKind.ERROR,
        data: null,
        error: value!.toString(),
      };
    default:
      return state;
  }
}

// 'T' generic represents the type of the HTTP request passed to 'useHttp' function
function useHttp<T extends HTTPRequestType>(httpRequest: T) {
  const [httpState, dispatch] = useReducer<
    React.Reducer<
      HTTPState<Awaited<ReturnType<T>>>,
      HTTPAction<Awaited<ReturnType<T>>>
    >
  >(httpReducer, initialState);

  const sendHttpRequest = useCallback(
    async <D extends object | number>(requestData?: D) => {
      try {
        dispatch({ type: HTTPStateKind.SEND });

        const responseData: Awaited<ReturnType<T>> = await httpRequest(
          requestData
        );

        dispatch({ type: HTTPStateKind.SUCCESS, value: responseData ?? null });
      } catch (err: any) {
        dispatch({
          type: HTTPStateKind.ERROR,
          errorMessage: err.message || "Une erreur s'est produit !",
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
