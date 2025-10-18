import { Helmet } from "react-helmet-async";
import Home from "../components/Layout/Home";

// component
const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Accueil - Site Gîtes</title>
        <meta name="description" content="Bienvenue sur le site des gîtes" />
      </Helmet>
      <Home />
    </>
  );
};

export default HomePage;
