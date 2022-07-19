import classes from "./Card.module.css";

const Card = (props) => {
  const cardClasses = `${classes.card} ${props.className}`;

  return <article className={cardClasses}>{props.children}</article>;
};

export default Card;
