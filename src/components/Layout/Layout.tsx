import React from "react";
import { useAppDispatch } from "../../hooks/use-store";
import { menuActions } from "../../store/menu";
import Footer from "./Footer";
import Header from "./Header";

// interfaces
interface LayoutProps {
  children: JSX.Element;
}

// component
const Layout: React.FC<LayoutProps> = (props) => {
  const dispatch = useAppDispatch();

  return (
    <div onClick={() => dispatch(menuActions.closeMenu())}>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
