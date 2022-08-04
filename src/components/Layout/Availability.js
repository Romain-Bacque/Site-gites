import { useEffect, useState } from "react";
import classes from "./Availability.module.css";
import Planning from "./Planning";

const Availability = () => {
  const [showDoubleView, setShowDoubleView] = useState(false);

  useEffect(() => {
    setShowDoubleView(window.innerWidth > 700 ? true : false);
    window.addEventListener("resize", () => {
      setShowDoubleView(window.innerWidth > 700 ? true : false);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setShowDoubleView(window.innerWidth > 700 ? true : false);
      });
    };
  }, []);

  return (
    <div className={classes.availability}>
      <Planning
        doubleView={showDoubleView}
        className="react-calendar--availability"
      />
    </div>
  );
};

export default Availability;
