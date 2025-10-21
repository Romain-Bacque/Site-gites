import classes from "./style.module.css";

// component
const Footer: React.FC = () => {
  return (
    <footer className={classes.footer}>
      <p>
        © 2022 <span className="bold">Gites ariège.</span> Tous droits réservés.
      </p>
      <div>
        <span>Contact : </span>
        <a href="mailto:bacqueflorence@wanadoo.fr">jf.gite.09@orange.fr </a>
      </div>
    </footer>
  );
};

export default Footer;
