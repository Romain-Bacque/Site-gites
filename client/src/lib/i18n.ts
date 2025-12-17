import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    backend: {
      debug: process.env.NODE_ENV === "development",
      fallbackLng: "fr",
      supportedLngs: ["fr", "en"],
      interpolation: { escapeValue: false },
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
