import { useReducer, useCallback } from "react";

// enums
enum HTTPStateKind {
  PENDING = 1,
  SUCCESS,
  ERROR,
}

// type aliases
type HTTPRequestType = (arg: any) => Promise<any>;
type ErrorType = string | null;
type DataType<T> = T | null;
type ParameterType<T> = T extends (arg: infer U) => any ? U : never;

// interfaces
interface HTTPState<T> {
  statut: HTTPStateKind | null;
  data: DataType<T>;
  error: ErrorType;
}
interface HTTPAction<T> {
  cacheKey?: string;
  type: HTTPStateKind;
  value?: DataType<T>;
  errorMessage?: ErrorType;
}

// function to create a cache in sessionStorage if 'cacheKey' is provided
function getInitialState(cacheKey?: string) {
  let item = null;

  if (cacheKey) {
    try {
      item = sessionStorage.getItem(cacheKey);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    statut: null,
    data: item ? JSON.parse(item) : null,
    error: null,
  };
}

// component
function httpReducer<T>(
  state: HTTPState<T>,
  action: HTTPAction<T>
): HTTPState<T> {
  const { type, value, errorMessage, cacheKey } = action;

  switch (type) {
    case HTTPStateKind.PENDING:
      return {
        statut: HTTPStateKind.PENDING,
        data: null,
        error: null,
      };
    case HTTPStateKind.SUCCESS:
      if (cacheKey) {
        try {
          window.sessionStorage.setItem(cacheKey, JSON.stringify(value));
        } catch (error) {
          console.error(error);
        }
      }
      return {
        statut: HTTPStateKind.SUCCESS,
        data: value || null,
        error: null,
      };
    case HTTPStateKind.ERROR:
      return {
        statut: HTTPStateKind.ERROR,
        data: null,
        error: errorMessage || null,
      };
    default:
      return state;
  }
}

// 'T' generic represents the type of the HTTP request passed to 'useHttp' function
function useHttp<T extends HTTPRequestType>(httpRequest: T, cacheKey?: string) {
  const [httpState, dispatch] = useReducer<
    React.Reducer<
      HTTPState<Awaited<ReturnType<T>>>,
      HTTPAction<Awaited<ReturnType<T>>>
    >
  >(httpReducer, getInitialState(cacheKey));

  const sendHttpRequest = useCallback(
    async (requestData?: ParameterType<T>) => {
      try {
        dispatch({ type: HTTPStateKind.PENDING, cacheKey });

        const { data } = getInitialState(cacheKey);

        const responseData: Awaited<ReturnType<T>> = data
          ? data
          : await httpRequest(requestData);

        dispatch({
          type: HTTPStateKind.SUCCESS,
          value: responseData ?? null,
          cacheKey,
        });
      } catch (err: any) {
        let errorMessage: string | null = null;

        const status: number = err.response.status;

        switch (status) {
          case 400:
            errorMessage = "Erreur dans un/plusieurs champs.";
            break;
          case 401:
            errorMessage = "Action non autorisé.";
            break;
          case 409:
            errorMessage = "Utilisateur déjà enregistré.";
            break;
          default:
            errorMessage = "Une erreur s'est produit !";
        }

        dispatch({
          type: HTTPStateKind.ERROR,
          errorMessage,
          cacheKey,
        });
      }
    },
    [httpRequest, cacheKey]
  );

  return {
    sendHttpRequest,
    ...httpState,
  };
}

export default useHttp;
