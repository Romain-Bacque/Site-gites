import { useAppDispatch, useAppSelector } from "../../../hooks/use-store";

import React from "react";
import { menuActions } from "../../../store/menu";
import Footer from "../Footer";
import Header from "../Header";
import LoaderAndAlert from "../../UI/LoaderAndAlert";

// interfaces
interface LayoutProps {
  children: JSX.Element;
}

// component
const Layout: React.FC<LayoutProps> = (props) => {
  const loading = useAppSelector(state => state.loading)
  const dispatch = useAppDispatch();
  
  return (
    <div onClick={() => dispatch(menuActions.closeMenu())}>
      <Header />
      <main>
        <LoaderAndAlert
          statut={loading.statut}
          message={{
            success: loading.message.success,
            error: loading.message.error,
          }}
        />
        {props.children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
