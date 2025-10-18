import AllBookings from "../components/Layout/AllBookings";
import { Helmet } from "react-helmet-async";

// component
const AllBookingsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Toutes les réservations</title>
        <meta
          name="description"
          content="Page affichant toutes les réservations."
        />
      </Helmet>
      <AllBookings />
    </>
  );
};

export default AllBookingsPage;
