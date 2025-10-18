import { FC } from "react";
import EmailConfirm from "../components/Layout/authentication/EmailConfirm";
import { Helmet } from "react-helmet-async";

const EmailConfirmationPage: FC = () => {
  return (
    <>
      <Helmet>
        <title>Confirmation d'email</title>
        <meta
          name="description"
          content="Page de confirmation d'email pour les utilisateurs."
        />
      </Helmet>
      <EmailConfirm />
    </>
  );
};

export default EmailConfirmationPage;
