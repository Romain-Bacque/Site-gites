import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/use-store";

import { Route, Redirect, Switch, useHistory } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import SheltersPage from "./pages/SheltersPage";
import GalleryPage from "./pages/GalleryPage";
import AuthPage from "./pages/AuthPage";
import { userVerification } from "./lib/api";
import { authActions } from "./store/auth";
import AllBookingsPage from "./pages/AllBookingsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import { HelmetProvider } from "react-helmet-async";
import { useMyQuery } from "./hooks/use-query";

// component
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const pathname = history.location.pathname;
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);

  const { isSuccess } = useMyQuery({
    queryKey: ["userVerification"],
    queryFn: userVerification,
  });

  // 'isAuthentificated' store state property is set to true if user is authenticated
  useEffect(() => {
    if (isSuccess) {
      dispatch(authActions.login());
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    if (pathname.includes("set-admin")) {
      dispatch(authActions.isAdmin());
    } else if (pathname.includes("set-user")) {
      dispatch(authActions.isUser());
    }
  }, [pathname, history, dispatch]);

  return (
    <HelmetProvider>
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
            <Route path="/auth/email-confirm">
              <EmailConfirmationPage />
            </Route>
          )}
          {!isAuth && (
            <Route path="/auth/forgot-password" exact>
              <ForgotPasswordPage />
            </Route>
          )}
          {!isAuth && (
            <Route path="/auth/reset-password">
              <ResetPasswordPage />
            </Route>
          )}
          <Route path="/gites" exact>
            <SheltersPage />
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
    </HelmetProvider>
  );
};

export default App;
