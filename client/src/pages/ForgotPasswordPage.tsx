import React from "react";
import { Helmet } from "react-helmet-async";
import ForgotPassword from "../components/Layout/authentication/ForgotPassword";

const ForgotPasswordPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Mot de passe oublié - VotreAppName</title>
        <meta name="description" content="Demandez la réinitialisation de votre mot de passe pour votre compte." />
      </Helmet>
      <ForgotPassword />
    </>
  );
};

export default ForgotPasswordPage;
