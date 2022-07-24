import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import classes from "./Header.module.css";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import { logoutRequest } from "../../lib/api";
import useHttp from "../../hooks/use-http";

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [scrollActive, setScrollActive] = useState(false);
  const { sendHttpRequest, statut: logoutStatut } = useHttp(logoutRequest);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const isAuth = useSelector((state) => state.auth.isAuthentificated);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrollActive(true);
      } else {
        setScrollActive(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleToggleButton = (event) => {
    event.stopPropagation();

    setToggleMenu((prevToggleMenu) => !prevToggleMenu);
  };

  const handleLoginLink = (event) => {
    setToggleMenu((prevToggleMenu) => !prevToggleMenu);

    if (isAuth) {
      event.preventDefault();

      sendHttpRequest();
    }
  };

  // logout
  useEffect(() => {
    if (logoutStatut === "success") {
      dispatch(authActions.logout());
    }
  }, [logoutStatut, dispatch]);

  return (
    <header
      className={`${
        (scrollActive || toggleMenu) && classes["background-active"]
      } ${classes.header}`}
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
            toggleMenu ? classes["active-menu"] : ""
          }`}
        >
          <div className={classes["menu-button__line"]}></div>
          <div className={classes["menu-button__line"]}></div>
          <div className={classes["menu-button__line"]}></div>
        </div>
        <nav
          className={`${classes.header__nav} ${
            toggleMenu ? classes["active-nav"] : ""
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
                  onClick={handleLoginLink}
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
