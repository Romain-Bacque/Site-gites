import classes from "./style.module.css";
import { useTranslation } from "react-i18next";

// component
const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={classes.footer}>
      <p>
        © 2022 <span className="bold">Gîtes Ariège.</span>{" "}
        {t("footer.rights")}
      </p>
      <div>
        <span>{t("footer.contact")}: </span>
        <a href="mailto:bacqueflorence@wanadoo.fr">jf.gite.09@orange.fr</a>
      </div>
    </footer>
  );
};

export default Footer;
