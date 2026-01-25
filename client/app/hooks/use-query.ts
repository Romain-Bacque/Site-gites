/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  useQueries,
  UseQueryResult,
} from "@tanstack/react-query";

// Aliases
type HTTPRequestType<T = any, R = any> = (arg: T) => Promise<R>;
type QueryKey = string | number | readonly (string | number)[];
type queryOptions<T = any> = UseQueryOptions<T>;
type mutationOptions<TRequest, TResponse> = UseMutationOptions<
  TResponse,
  any,
  TRequest
> & {
  statusMessage?: string;
};
type UseMyQueryType<T = any> = queryOptions<T> & {
  queryFn: () => Promise<T>;
  queryKey: QueryKey;
};

function getMessageFromError(error: any): string {
  if (!error) return "";
  const status: number | undefined =
    (error as any)?.response?.status || (error as any).status;

  switch (status) {
    case 400:
      return "Erreur dans un/plusieurs champs.";
    case 401:
      return "Accès non autorisé.";
    case 404:
      return "Ressource non trouvée.";
    case 409:
      return "Utilisateur/ressource déjà enregistré.";
    default:
      return "Une erreur est survenue.";
  }
}

// Custom query hook
// 'T' generic represents the type of data returned by the query (here it's the return type of the callback function), if not specified, defaults to 'any'
export function useMyQuery<T = any>({
  queryFn,
  queryKey,
  ...props
}: UseMyQueryType<T>) {
  const { data, ...rest } = useQuery<T>({
    queryKey,
    queryFn,
    ...props,
  });

  const formattedData = data ?? null;

  return {
    data: formattedData,
    ...rest,
  };
}

// Custom hook for multiple queries using useQueries
// Accepts an array of queryOptions (each can have its own statusMessage)

export function useMyQueries<T extends readonly UseMyQueryType<any>[]>(
  queries: T
): {
  [K in keyof T]: UseQueryResult<
    T[K] extends UseMyQueryType<infer R> ? R : never
  > & { statusMessage?: string };
} {
  const prepared = queries.map(({ queryKey, queryFn, ...rest }) => ({
    queryKey,
    queryFn,
    ...rest,
  }));

  const results = useQueries({
    queries: prepared,
  }) as {
    [K in keyof T]: UseQueryResult<
      T[K] extends UseMyQueryType<infer R> ? R : never
    >;
  };

  return results;
}

// Custom mutation hook
// we use Trequest here to represent the type of data sent to the mutation function
// and TResponse to represent the type of data returned by the mutation function

export function useMyMutation<TRequest = any, TResponse = any>({
  mutationFn,
  onErrorFn,
  onSuccessFn,
  ...props
}: {
  mutationFn: HTTPRequestType<TRequest, TResponse>;
  onErrorFn?: (error: any, errorMessage: string) => void;
  onSuccessFn?: (data: TResponse, vars: TRequest, context: any) => void;
} & mutationOptions<TRequest, TResponse>) {
  const { mutate, status, ...rest } = useMutation<TResponse, any, TRequest>({
    mutationFn,
    onError: (err: any) => {
      const errorMessage = getMessageFromError(err);

      if (onErrorFn) onErrorFn(err, errorMessage);
    },
    onSuccess: onSuccessFn,
    ...props,
  });

  return {
    mutate,
    status,
    ...rest,
  };
}
