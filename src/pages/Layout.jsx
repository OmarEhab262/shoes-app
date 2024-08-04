import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

const RootLayout = () => {
  return (
    <div className="relative">
      <Nav />
      <Outlet />
    </div>
  );
};

export default RootLayout;
