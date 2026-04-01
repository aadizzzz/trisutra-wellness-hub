import { Link } from "react-router-dom";
import logo from "@/assets/trisutra-logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <img src={logo} alt="TriSutra Ayurveda" className="h-20 sm:h-24 w-auto mb-4 brightness-200" />
            <p className="font-body text-sm opacity-80 leading-relaxed">
              Ancient wisdom, modern wellness. TriSutra brings you authentic Ayurvedic solutions rooted in centuries of tradition.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-body text-sm opacity-80">
              <li><Link to="/shop" className="hover:opacity-100 transition-opacity">Shop</Link></li>
              <li><Link to="/product/swarnprashan" className="hover:opacity-100 transition-opacity">Swarnprashan</Link></li>
              <li><Link to="/blog" className="hover:opacity-100 transition-opacity">Blog</Link></li>
              <li><Link to="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Wellness</h4>
            <ul className="space-y-2 font-body text-sm opacity-80">
              <li><Link to="/blog" className="hover:opacity-100 transition-opacity">Ayurveda Tips</Link></li>
              <li><Link to="/blog" className="hover:opacity-100 transition-opacity">Child Health</Link></li>
              <li><Link to="/blog" className="hover:opacity-100 transition-opacity">Immunity Boosting</Link></li>
              <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Consult a Vaidya</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 font-body text-sm opacity-80">
              <li>info@trisutra.in</li>
              <li>+91 98765 43210</li>
              <li>Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center font-body text-sm opacity-60">
          <p>© {new Date().getFullYear()} TriSutra Ayurveda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
