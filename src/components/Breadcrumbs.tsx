import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="container-custom py-4 flex items-center gap-2 text-sm font-body text-muted-foreground">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");

        return (
          <div key={to} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            {last ? (
              <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-none" aria-current="page">
                {label}
              </span>
            ) : (
              <Link to={to} className="hover:text-primary transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
