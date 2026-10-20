import { NavLink } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <NavLink to="/" className="brand-link" aria-label="Carbon Grove home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>Carbon Grove</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Overview</NavLink>
          <NavLink to="/log" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Log a habit</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Analytics</NavLink>
        </div>
      </nav>
    </header>
  );
}