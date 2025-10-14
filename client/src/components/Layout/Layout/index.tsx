import { useAppDispatch, useAppSelector } from "../../../hooks/use-store";
import React, { useEffect, useState } from "react";
import { menuActions } from "../../../store/menu";
import Footer from "../Footer";
import Header from "../Header";
import LoaderAndAlert from "../../UI/LoaderAndAlert";
import { HTTPStateKind } from "../../../global/types";
import useHTTPState from "../../../hooks/use-http-state";

// interfaces
interface LayoutProps {
  children: JSX.Element;
}

let isFirstRender = true;

// component
const Layout: React.FC<LayoutProps> = (props) => {
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const handleHTTPState = useHTTPState();
  const loading = useAppSelector((state) => state.loading);
  const dispatch = useAppDispatch();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isAuth && isFirstRender) handleHTTPState(2, "Bienvenue !");
    if (!isAuth) isFirstRender = true;
    else isFirstRender = false;
  }, [handleHTTPState, isAuth]);

  if (!isMounted) {
    // Show a loader while the DOM is incomplete
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoaderAndAlert statut={HTTPStateKind.PENDING} />
      </div>
    );
  }

  return (
    <div onClick={() => dispatch(menuActions.closeMenu())}>
      <Header />
      <main>
        <LoaderAndAlert statut={loading.statut} message={loading.message} />
        {props.children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
