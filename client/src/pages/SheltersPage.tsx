import Shelters from "../components/Layout/Shelters";

// types
interface SheltersPageProps {
  sheltersData: {
    _id: string;
    title: string;
    number: number;
  }[] | null;
}

// component
const SheltersPage: React.FC<SheltersPageProps> = ({ sheltersData }) => {
  return <Shelters sheltersData={sheltersData} />;
};

export default SheltersPage;
