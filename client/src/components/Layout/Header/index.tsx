import React, { MouseEventHandler, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/use-store";

import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import classes from "./style.module.css";
import { authActions } from "../../../store/auth";
import { menuActions } from "../../../store/menu";
import { logoutRequest } from "../../../lib/api";
import useHttp from "../../../hooks/use-http";
import { loadingActions } from "../../../store/loading";
import { HTTPStateKind } from "../../../global/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

// component
const Header: React.FC = () => {
  const [scrollActive, setScrollActive] = useState(false);
  const {
    sendHttpRequest: sendLogoutHttpRequest,
    statut: logoutStatut,
    error: logoutErrorMessage,
  } = useHttp(logoutRequest);
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const isMenuOpen = useAppSelector((state) => state.menu.isOpen);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrollActive(true);
      } else {
        setScrollActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      sendLogoutHttpRequest();
    }
  };

  // logout
  useEffect(() => {
    if (logoutStatut === HTTPStateKind.SUCCESS) {
      dispatch(authActions.logout());
    }
  }, [logoutStatut, dispatch]);

  // loading
  useEffect(() => {
    if (logoutStatut) {
      dispatch(loadingActions.setStatut(logoutStatut));
      dispatch(
        loadingActions.setMessage({
          success: null,
          error: logoutErrorMessage,
        })
      );
    }
  }, [logoutStatut]);

  return (
    <header
      className={`${classes.header} ${isMenuOpen && classes["active-nav"]}`}
    >
      <div
        className={`${scrollActive && classes["background-active"]} ${
          classes.header__wrapper
        }`}
      >
        <div className={classes["header__title-container"]}>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} />
          </Link>
          <h1 className={classes.header__title}>Gîtes.</h1>
        </div>
        {/* Toggle menu button */}
        <div
          onClick={handleToggleButton}
          className={`${classes["menu-button"]} ${
            isMenuOpen ? classes["active-menu"] : ""
          }`}
        >
          <div className={classes["menu-button__line"]}></div>
          <div className={classes["menu-button__line"]}></div>
          <div className={classes["menu-button__line"]}></div>
        </div>
        <nav
          onClick={(event) => event.stopPropagation()}
          className={`${classes.header__nav} ${
            isMenuOpen ? classes["active-nav"] : ""
          }`}
        >
          <ul className={classes["header__list"]}>
            <li className={classes.header__list}>
              <NavLink
                onClick={handleCloseMenu}
                className={classes.header__link}
                activeClassName={classes["active-link"]}
                to="/home"
              >
                Accueil
              </NavLink>
            </li>
            <li className={classes.header__list}>
              <NavLink
                onClick={handleCloseMenu}
                className={classes.header__link}
                activeClassName={classes["active-link"]}
                to="/gites"
              >
                Gîtes
              </NavLink>
            </li>
            <li className={classes.header__list}>
              <NavLink
                onClick={handleCloseMenu}
                className={`${classes.header__link}`}
                activeClassName={classes["active-link"]}
                to="/albums"
              >
                Albums
              </NavLink>
            </li>
            {isAuth && (
              <li className={classes.header__list}>
                <NavLink
                  onClick={handleCloseMenu}
                  className={`${classes.header__link}`}
                  activeClassName={classes["active-link"]}
                  to="/admin/allBookings"
                >
                  Demandes
                </NavLink>
              </li>
            )}
            {!isAuth && isAdmin && (
              <Link
                onClick={handleCloseMenu}
                className={`button button--alt ${classes.header__auth}`}
                to="/authentification"
              >
                Connexion
              </Link>
            )}
          </ul>
          {isAuth && (
            <button
              className={`button button--alt ${classes.header__auth}`}
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
