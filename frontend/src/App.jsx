import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Menu, X, Library, ShieldCheck, Info, Bookmark } from "lucide-react";
import ThemeToggle from "./components/ThemeToggle.jsx";
import BackToTop from "./components/BackToTop.jsx";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: "/browse", label: "Browse", icon: Library },
    { to: "/verify", label: "Verify", icon: ShieldCheck },
    { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { to: "/about", label: "About", icon: Info },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">
              <span className="brand-crescent">☪</span>
            </span>
            <span className="brand-name">Sohih<span className="brand-accent">Finder</span></span>
          </Link>

          <nav className="nav">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <button
              className="menu-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-nav">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <p className="footer-brand">SohihFinder</p>
            <p className="footer-text">
              A free, open-source hadith reference platform. Grades shown are from established
              scholarly works, not automated rulings.
            </p>
          </div>
          <div className="footer-links">
            <Link to="/browse">Browse</Link>
            <Link to="/verify">Verify</Link>
            <Link to="/about">About</Link>
          </div>
        </div>
        <p className="footer-bottom">
          © {new Date().getFullYear()} SohihFinder · Data: fawazahmed0/hadith-api
        </p>
      </footer>

      <BackToTop />
    </div>
  );
}
