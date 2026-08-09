import { Link, NavLink, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">☪</span>
            <span>SohihFinder</span>
          </Link>
          <nav className="nav">
            <NavLink to="/browse" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Browse
            </NavLink>
            <NavLink to="/verify" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Verify
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              About
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          Free, open-source hadith reference platform. Grades shown are from established scholarly
          works, not automated rulings.
        </p>
      </footer>
    </div>
  );
}
