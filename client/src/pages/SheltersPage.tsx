import { Helmet } from "react-helmet-async";
import Shelters from "../components/Layout/Shelters";

// component
const SheltersPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Liste des gîtes</title>
        <meta name="description" content="Liste des gites" />
      </Helmet>
      <Shelters />
    </>
  );
};

export default SheltersPage;
