"use client";

import { MouseEventHandler, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./style.module.css";

import { authActions } from "../../../store/auth";
import { menuActions } from "../../../store/menu";
import { logoutRequest } from "../../../lib/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import { useMyMutation } from "../../../hooks/use-query";
import useHTTPState from "../../../hooks/use-http-state";
import LanguageSwitcher from "../../../components/UI/LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/app/hooks/use-store";

const Header: React.FC = () => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const handleHTTPState = useHTTPState();
  const t = useTranslations();

  const [scrollActive, setScrollActive] = useState(false);

  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const isMenuOpen = useAppSelector((state) => state.menu.isOpen);

  const logoutMutation = useMyMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      dispatch(authActions.logout());
    },
    onErrorFn: (_error, errorMessage) => {
      handleHTTPState("error", errorMessage);
    },
  });

  const handleToggleButton: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    dispatch(menuActions.toggleMenu());
  };

  const handleCloseMenu: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.stopPropagation();
    dispatch(menuActions.closeMenu());
  };

  const handleLogout: MouseEventHandler<HTMLButtonElement> = (event) => {
    dispatch(menuActions.toggleMenu());
    if (isAuth) {
      event.preventDefault();
      logoutMutation.mutate(null);
    }
  };

  const isActive = (href: string) =>
    pathname === href ? classes["active-link"] : "";

  const handleTouchStart = () => {
    setTouchStart(Date.now());
  };

  const handleTouchEnd = () => {
    if (!touchStart) return;

    const pressDuration = Date.now() - touchStart;

    if (pressDuration > 800) {
      setShowLogin(true);
    }

    setTouchStart(null);
  };

  useEffect(() => {
    const handleScroll = () => setScrollActive(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "L") {
        setShowLogin(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header
      className={`${classes.header} ${isMenuOpen ? classes["active-nav"] : ""}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`${scrollActive ? classes["background-active"] : ""} ${
          classes.header__wrapper
        }`}
      >
        <div className={classes["header__title-container"]}>
          <Link href={`/${locale}`} onClick={handleCloseMenu}>
            <FontAwesomeIcon icon={faHome} />
          </Link>
          <h1 className={classes.header__title}>Gîtes Du Quer.</h1>
        </div>

        <div
          onClick={handleToggleButton}
          className={`${classes["menu-button"]} ${
            isMenuOpen ? classes["active-menu"] : ""
          }`}
        >
          <div className={classes["menu-button__line"]} />
          <div className={classes["menu-button__line"]} />
          <div className={classes["menu-button__line"]} />
        </div>

        <nav
          onClick={(event) => event.stopPropagation()}
          className={`${classes.header__nav} ${
            isMenuOpen ? classes["active-nav"] : ""
          }`}
        >
          <ul className={classes["header__list"]}>
            <li>
              <Link
                href={`/${locale}`}
                onClick={handleCloseMenu}
                className={`${classes.header__link} ${isActive(`/${locale}`)}`}
              >
                {t("header.home")}
              </Link>
            </li>

            <li>
              <Link
                href={`/${locale}/shelters`}
                onClick={handleCloseMenu}
                className={`${classes.header__link} ${isActive(`/${locale}/shelters`)}`}
              >
                {t("header.shelters")}
              </Link>
            </li>

            <li>
              <Link
                href={`/${locale}/albums`}
                onClick={handleCloseMenu}
                className={`${classes.header__link} ${isActive(`/${locale}/albums`)}`}
              >
                {t("header.albums")}
              </Link>
            </li>

            {isAuth && (
              <li>
                <Link
                  href={`/${locale}/bookings`}
                  onClick={handleCloseMenu}
                  className={`${classes.header__link} ${isActive(
                    `/${locale}/bookings`,
                  )}`}
                >
                  {t("header.requests")}
                </Link>
              </li>
            )}

            {showLogin && !isAuth && (
              <li>
                <Link
                  href={`/${locale}/login`}
                  onClick={handleCloseMenu}
                  className={`button button--alt ${classes.header__auth}`}
                >
                  {t("header.login")}
                </Link>
              </li>
            )}
          </ul>

          {isAuth && (
            <button
              className={`button button--alt ${classes.header__auth}`}
              onClick={handleLogout}
            >
              {t("header.logout")}
            </button>
          )}

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;
