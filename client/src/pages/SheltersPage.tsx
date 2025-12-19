import { Helmet } from "react-helmet-async";
import Shelters from "../components/Layout/Shelters";

// component
const SheltersPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Liste des gîtes</title>
        <meta name="description" content="Liste des gites à Erce en Ariège (09), au cœur du Couserans. Gîtes tout confort, nature, randonnées et calme." />
      </Helmet>
      <Shelters />
    </>
  );
};

export default SheltersPage;
