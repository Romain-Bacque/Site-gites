/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/app/hooks/use-store";
import styles from "./style.module.css";

const languages = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const LanguageSwitcher = () => {
  const locale = useLocale(); // langue courante (fr / en)
  const pathname = usePathname();
  const router = useRouter();

  const { isOpen: isMenuOpen } = useAppSelector((state) => state.menu);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      setOpen(false);
    }
  }, [isMenuOpen]);

  const changeLanguage = (newLocale: string) => {
    // Remplace /fr ou /en dans l’URL
    const segments = pathname.split("/");
    
    segments[1] = newLocale;

    const newPath = segments.join("/");

    router.push(newPath);
    setOpen(false);
  };

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className={styles.languageSwitcher}>
      {/* Bouton principal */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={styles.button}
        aria-haspopup="true"
        aria-expanded={open}
      >
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
                locale === lang.code ? styles.active : ""
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
