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
type ParameterType<T> = T extends (arg: infer U) => any ? U : never

// interfaces
interface HTTPState<T> {
  statut: HTTPStateKind | null;
  data: DataType<T>;
  error: ErrorType;
}
interface HTTPAction<T> {
  type: HTTPStateKind;
  value?: DataType<T>;
  errorMessage?: ErrorType;
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
  const { type, value, errorMessage } = action;

  switch (type) {
    case HTTPStateKind.PENDING:
      return {
        statut: HTTPStateKind.PENDING,
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
        error: errorMessage || null,
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
    async (requestData?: ParameterType<T>) => {
      try {
        dispatch({ type: HTTPStateKind.PENDING });

        const responseData: Awaited<ReturnType<T>> = await httpRequest(
          requestData
        );

        dispatch({ type: HTTPStateKind.SUCCESS, value: responseData ?? null });
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
        }

        dispatch({
          type: HTTPStateKind.ERROR,
          errorMessage: errorMessage || "Une erreur s'est produit !",
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
