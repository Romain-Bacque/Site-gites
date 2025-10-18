import { Helmet } from "react-helmet-async";
import Auth from "../components/Layout/authentication/Auth";

// component
const AuthPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Authentification</title>
        <meta
          name="description"
          content="Page d'authentification pour les utilisateurs."
        />
      </Helmet>
      <Auth />
    </>
  );
};

export default AuthPage;
