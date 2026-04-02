import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import logo from "@/assets/trisutra-logo.png";
import { CartSheet } from "./CartSheet";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/product/swarnprashan", label: "Swarnprashan" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-custom flex items-center justify-between h-20 sm:h-24 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 flex-1">
          <img src={logo} alt="TriSutra Ayurveda" className="h-20 sm:h-24 w-auto" />
        </Link>

        <div className="hidden md:flex items-center justify-center gap-8 flex-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center justify-end gap-4 flex-1">
          <CartSheet />
          <Link to={user ? "/account" : "/login"} className="text-muted-foreground hover:text-primary transition-colors">
            <User className="h-5 w-5" />
            <span className="sr-only">{user ? "Account" : "Login"}</span>
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block font-body text-sm font-medium py-2 transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-4 pt-4 border-t mt-4 border-border/50">
              <CartSheet />
              <Link to={user ? "/account" : "/login"} className="flex items-center gap-2 font-body text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                <User className="h-5 w-5" />
                {user ? "Account" : "Login"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
