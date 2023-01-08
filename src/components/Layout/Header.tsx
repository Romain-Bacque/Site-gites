import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import classes from "./Header.module.css";
import { authActions } from "../../store/auth";
import { menuActions } from "../../store/menu";
import { logoutRequest } from "../../lib/api";
import useHttp from "../../hooks/use-http";
import { useAppDispatch, useAppSelector } from "../../hooks/use-store";

// component
const Header: React.FC = () => {
  const [scrollActive, setScrollActive] = useState(false);
  const { sendHttpRequest, statut: logoutStatut } = useHttp(logoutRequest);
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const isOpen = useAppSelector((state) => state.menu.isOpen);
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
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

  const handleToggleButton = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(menuActions.toggleMenu());
  };

  const handleAuthLink = (event: React.MouseEvent) => {
    dispatch(menuActions.toggleMenu());

    if (isAuth) {
      event.preventDefault();

      sendHttpRequest();
    }
  };

  // logout
  useEffect(() => {
    if (logoutStatut === "success") {
      dispatch(authActions.logout());
      history.replace("/");
    }
  }, [logoutStatut, dispatch]);

  return (
    <header
      className={`${(scrollActive || isOpen) && classes["background-active"]} ${
        classes.header
      }`}
    >
      <div className={classes.header__wrapper}>
        <div className={classes["header__title-container"]}>
          <h1 className={classes.header__title}>Gîtes Jo & Flo</h1>
          <span className={classes.header__subtitle}>
            Dans un lieux reposant
          </span>
        </div>
        <div
          onClick={handleToggleButton}
          className={`${classes["menu-button"]} ${
            isOpen ? classes["active-menu"] : ""
          }`}
        >
          <div className={classes["menu-button__line"]}></div>
          <div className={classes["menu-button__line"]}></div>
          <div className={classes["menu-button__line"]}></div>
        </div>
        <nav
          onClick={(event) => event.stopPropagation()}
          className={`${classes.header__nav} ${
            isOpen ? classes["active-nav"] : ""
          }`}
        >
          <ul className={classes["header__unorganized-list"]}>
            <li className={classes.header__list}>
              <NavLink
                onClick={handleToggleButton}
                className={classes.header__link}
                activeClassName={classes["active-link"]}
                to="/home"
              >
                Accueil
              </NavLink>
            </li>
            <li className={classes.header__list}>
              <NavLink
                onClick={handleToggleButton}
                className={classes.header__link}
                activeClassName={classes["active-link"]}
                to="/gites"
              >
                Gîtes
              </NavLink>
            </li>
            <li className={classes.header__list}>
              <NavLink
                onClick={handleToggleButton}
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
                  onClick={handleToggleButton}
                  className={`${classes.header__link}`}
                  activeClassName={classes["active-link"]}
                  to="/admin/allBookings"
                >
                  Demandes
                </NavLink>
              </li>
            )}
            {(isAuth || isAdmin) && (
              <li className={classes.header__list}>
                <Link
                  className={`${classes.header__link} ${classes.header__auth}`}
                  to="/authentification"
                  onClick={handleAuthLink}
                >
                  {!isAuth ? "Connexion" : "Déconnexion"}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
