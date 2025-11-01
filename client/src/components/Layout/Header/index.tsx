import React, { MouseEventHandler, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/use-store";
import { Link, NavLink } from "react-router-dom";
import classes from "./style.module.css";
import { authActions } from "../../../store/auth";
import { menuActions } from "../../../store/menu";
import { logoutRequest } from "../../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useMyMutation } from "hooks/use-query";
import useHTTPState from "hooks/use-http-state";

// component
const Header: React.FC = () => {
  const handleHTTPState = useHTTPState();
  const [scrollActive, setScrollActive] = useState(false);
  const dispatch = useAppDispatch();

  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const isMenuOpen = useAppSelector((state) => state.menu.isOpen);

  // ✅ Mutation React Query pour le logout
  const logoutMutation = useMyMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      dispatch(authActions.logout());
    },
    onErrorFn: (_error, errorMessage) => {
      handleHTTPState("error", errorMessage);
    },
  });

  useEffect(() => {
    const handleScroll = () => setScrollActive(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      logoutMutation.mutate(null);
    }
  };

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
          <h1 className={classes.header__title}>Gîtes Du Quer.</h1>
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
