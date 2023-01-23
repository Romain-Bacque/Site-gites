import classes from "./style.module.css";

// interfaces
interface CardProps {
  className?: string;
  children: JSX.Element | JSX.Element[] | null;
}

// component
const Card: React.FC<CardProps> = (props) => {
  const cardClasses = `${classes.card} ${props.className}`;

  return <article className={cardClasses}>{props.children}</article>;
};

export default Card;
