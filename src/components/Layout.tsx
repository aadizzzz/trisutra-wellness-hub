import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 sm:pt-24">
        <Breadcrumbs />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
