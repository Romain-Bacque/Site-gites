import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/use-store";
import useHttp from "./hooks/use-http";

import { Route, Redirect, Switch, useHistory } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import SheltersPage from "./pages/SheltersPage";
import GalleryPage from "./pages/GalleryPage";
import AuthPage from "./pages/AuthPage";
import { getShelters, loadUserInfos } from "./lib/api";
import { authActions } from "./store/auth";
import AllBookingsPage from "./pages/AllBookingsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { HTTPStateKind } from "./global/types";
import { loadingActions } from "./store/loading";
import useLoading from "./hooks/use-loading";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";

// component
const App: React.FC = () => {
  const {
    sendHttpRequest: authCheckHttpRequest,
    statut: authCheckRequestStatut,
  } = useHttp(loadUserInfos);
  const {
    sendHttpRequest: getShelterHttpRequest,
    statut: getSheltersRequestStatut,
    data: sheltersData,
    error: getSheltersRequestError,
  } = useHttp(getShelters);
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const dispatch = useAppDispatch();
  const handleLoading = useLoading();
  const history = useHistory();
  const pathname = history.location.pathname;

  useEffect(() => {
    authCheckHttpRequest();
  }, []);

  useEffect(() => {
    getShelterHttpRequest();
  }, []);

  // 'isAuthentificated' store state property is set to true if user is authenticated
  useEffect(() => {
    if (authCheckRequestStatut === HTTPStateKind.SUCCESS) {
      dispatch(authActions.login());
    }
  }, [authCheckRequestStatut, dispatch]);

  // shelters request loading handling
  useEffect(() => {
    if (getSheltersRequestStatut) {
      handleLoading(
        getSheltersRequestStatut,
        null,
        null,
        getSheltersRequestError
      );
    }
  }, [getSheltersRequestError, getSheltersRequestStatut, handleLoading]);

  useEffect(() => {
    if (pathname.includes("set-admin")) {
      dispatch(authActions.isAdmin());
    } else if (pathname.includes("set-user")) {
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
          <Route path="/admin/email-confirm">
            <EmailConfirmationPage />
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
          <SheltersPage sheltersData={sheltersData} />
        </Route>
        <Route path="/albums">
          <GalleryPage sheltersData={sheltersData} />
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
