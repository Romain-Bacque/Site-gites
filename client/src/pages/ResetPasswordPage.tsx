import { Helmet } from "react-helmet-async";
import ResetPassword from "../components/Layout/authentication/ResetPassword";

// component
const ResetPasswordPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Réinitialiser le mot de passe</title>
        <meta name="description" content="Réinitialiser votre mot de passe" />
      </Helmet>
      <ResetPassword />
    </>
  );
};

export default ResetPasswordPage;
