import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/use-store";
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
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { HTTPStateKind } from "./global/types";

// component
const App: React.FC = () => {
  const { sendHttpRequest: authCheckHttpRequest, statut: authCheckRequestStatut } =
    useHttp(loadUserInfos);
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const pathname = history.location.pathname;

  useEffect(() => {
    authCheckHttpRequest();
  }, []);

  useEffect(() => {
    if(authCheckRequestStatut === HTTPStateKind.SUCCESS) {
      dispatch(authActions.login());
    }
  }, [authCheckRequestStatut]);

  useEffect(() => {
    if (pathname.includes("admin")) {
      dispatch(authActions.isAdmin());
    } else {
      dispatch(authActions.isUser());
    }
  }, [pathname, history, dispatch]);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>
        <Route path="/home">
          <HomePage />
        </Route>
        {isAuth && (
          <Route path="/admin/allBookings" exact>
            <AllBookingsPage />
          </Route>
        )}
        {!isAuth && (
          <Route path="/admin/forgot-password" exact>
            <ForgotPasswordPage />
          </Route>
        )}
        {!isAuth && (
          <Route path="/admin/reset-password/:id/:token" exact>
            <ResetPasswordPage />
          </Route>
        )}
        <Route path="/gites" exact>
          <GitesPage />
        </Route>
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
