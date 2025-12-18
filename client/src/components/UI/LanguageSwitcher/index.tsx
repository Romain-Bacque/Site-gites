import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./style.module.css";
import { useAppSelector } from "hooks/use-store";

const languages = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const LanguageSwitcher = () => {
  const { isOpen: isMenuOpen } = useAppSelector((state) => state.menu);
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    if (!isMenuOpen) {
      setOpen(false);
    }
  }, [isMenuOpen]);

  return (
    <div className={styles.languageSwitcher}>
      {/* Bouton principal */}
      <button onClick={() => setOpen(!open)} className={styles.button}>
        <span className={styles.flag}>{currentLang.flag}</span>
        <span className={`${styles.arrow} ${open ? styles.arrowUp : ""}`}>
          ▼
        </span>
      </button>

      {/* Menu déroulant */}
      {open && (
        <div className={styles.dropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`${styles.languageButton} ${
                i18n.language === lang.code ? styles.active : ""
              }`}
            >
              <span className={styles.languageFlag}>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
