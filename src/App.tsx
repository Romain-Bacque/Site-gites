import { useAppDispatch, useAppSelector } from "./hooks/use-store";
import React, { useEffect } from "react";
import useHttp from "./hooks/use-http";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import GitesPage from "./pages/GitesPage";
import GalleryPage from "./pages/GalleryPage";
import AuthPage from "./pages/AuthPage";
import { loadUserInfos } from "./lib/api";
import { authActions } from "./store/auth";
import AllBookingsPage from "./pages/AllBookingsPage";

const App: React.FC = () => {
  const { sendHttpRequest: sendUserHttpRequest, statut: authStatut } =
    useHttp(loadUserInfos);
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const pathname = history.location.pathname;

  useEffect(() => {
    sendUserHttpRequest();
  }, [isAuth, sendUserHttpRequest]);

  useEffect(() => {
    if (pathname.includes("admin")) {
      dispatch(authActions.isAdmin());
      history.replace(pathname.replace("admin", ""));
    } else if (pathname.includes("user")) {
      dispatch(authActions.isUser());
      history.replace(pathname.replace("user", ""));
    }
  }, [pathname, history, dispatch]);

  if (authStatut === "success") {
    dispatch(authActions.login());
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>
        <Route path="/home">
          <HomePage />
        </Route>
        <Route path="/gites" exact>
          <GitesPage />
        </Route>
        {isAuth && (
          <Route path="/admin/allBookings">
            <AllBookingsPage />
          </Route>
        )}
        <Route path="/gites/:giteId">
          <GitesPage />
        </Route>
        <Route path="/albums">
          <GalleryPage />
        </Route>
        <Route path="/authentification">
          <AuthPage />
        </Route>
        <Route path="*">
          <Redirect to="/home" />
        </Route>
      </Switch>
    </Layout>
  );
};

export default App;
