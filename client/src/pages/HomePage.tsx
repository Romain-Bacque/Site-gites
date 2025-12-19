import { Helmet } from "react-helmet-async";
import Home from "../components/Layout/Home";

// component
const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Accueil - Site Gîtes</title>
        <meta name="description" content="Bienvenue sur le site des gîtes à Erce en Ariège (09), au cœur du Couserans. Gîtes tout confort, nature, randonnées et calme." />
      </Helmet>
      <Home />
    </>
  );
};

export default HomePage;
