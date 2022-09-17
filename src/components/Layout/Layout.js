import React from "react";
import { useDispatch } from "react-redux";
import { menuActions } from "../../store/menu";
import Footer from "./Footer";
import Header from "./Header";

const Layout = (props) => {
  const dispatch = useDispatch();

  return (
    <div onClick={() => dispatch(menuActions.closeMenu())}>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
