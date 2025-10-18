import Gallery from "../components/Layout/Gallery";
import { Helmet } from "react-helmet-async";

// component
const GalleryPage: React.FC = () => { 
  return (
    <>
      <Helmet>
        <title>Galerie - Site Gîtes</title>
        <meta name="description" content="Galerie photos des gîtes" />
      </Helmet>
      <Gallery />
    </>
  );
};

export default GalleryPage;
