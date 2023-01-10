import classes from "./style.module.css";

// component
const Footer: React.FC = () => {
  return (
    <footer className={classes.footer}>
      <span>Contact :</span>
      <a href="mailto:bacqueflorence@wanadoo.fr"> bacqueflorence@wanadoo.fr</a>
    </footer>
  );
};

export default Footer;
