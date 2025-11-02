import ReactDOM from "react-dom/client";
import "./reset.css";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import store from "./store/index";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {ErrorBoundary} from "react-error-boundary";
import Fallback from "components/Layout/ErrorBoundaryFallback";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 300_000, // 5 minutes before data is considered stale
    },
  },
});

root.render(
  <ErrorBoundary FallbackComponent={Fallback}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools
          initialIsOpen={process.env.NODE_ENV === "development"}
        />
      </Provider>
    </QueryClientProvider>
  </ErrorBoundary>
);
