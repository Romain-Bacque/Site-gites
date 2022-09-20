import { useEffect, useState } from "react";
import classes from "./Availability.module.css";
import Planning from "./Planning";

const Availability = ({ shelter }) => {
  const [showDoubleView, setShowDoubleView] = useState(false);

  useEffect(() => {
    const handleShowDoubleView = () => {
      setShowDoubleView(window.innerWidth > 700 ? true : false);
    };

    handleShowDoubleView();

    window.addEventListener("resize", handleShowDoubleView);

    return () => {
      window.removeEventListener("resize", handleShowDoubleView);
    };
  }, []);

  return (
    <div className={classes.availability}>
      <Planning
        shelter={shelter}
        doubleView={showDoubleView}
        className="react-calendar--availability"
      />
    </div>
  );
};

export default Availability;
