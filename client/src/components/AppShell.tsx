import { Outlet } from "react-router";
import NavigationBar from "./NavigationBar.tsx";
import Footer from "./Footer.tsx";

function AppShell() {
  return (
    <>
      <NavigationBar />
      <Outlet />
      <Footer />
    </>
  );
}

export default AppShell;
