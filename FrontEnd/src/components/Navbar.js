import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAnimation } from '../components/AnimationContext';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStream, faCodeFork } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ isLoggedIn, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShouldAnimate } = useAnimation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const handleNavLinkClick = (link) => {
    setShouldAnimate(true);
    closeNav();
    setTimeout(() => {
      setShouldAnimate(false);
      navigate(link);
    }, 1000);
  };

  const userProfileClick = () => {
    setShouldAnimate(true);
    closeNav();
    // delete location.state.userId;
    setTimeout(() => {
      setShouldAnimate(false);
      // navigate('/profile');
      navigate('/profile', { state: { fromNavbar: true } });
    }, 1000);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top text-uppercase">
      <div className="container">
        <span className="navbar-brand header-font text-uppercase" to="" onClick={() => handleNavLinkClick('/')} >
          <FontAwesomeIcon icon={faCodeFork} /> TechConnect
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isNavOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
          onClick={toggleNav}
        >
          <span className="navbar-toggler-icon"><FontAwesomeIcon icon={faStream} /></span>
        </button>
        <div
          className={`collapse navbar-collapse${isNavOpen ? ' show' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav text-center">
            <li className="nav-item">
              <span className="nav-link header-font" to="" onClick={() => handleNavLinkClick('/')}>
                Home
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link header-font" to="" onClick={() => handleNavLinkClick('/developers')}>
                Developers
              </span>
            </li>
            {currentUser && currentUser.data.account_type === "Developer" && (
              <li className="nav-item">
                {currentUser ? (
                  <span className="nav-link header-font" onClick={() => userProfileClick()}>
                  Profile
                </span>
                ) : (
                  <span className="nav-link header-font" onClick={() => handleNavLinkClick('/profile')}>
                    Profile
                  </span>
                )}
              </li>
            )}
            {currentUser ? 
              <li className="nav-item">
                <span className="nav-link header-font" to="" onClick={() => handleNavLinkClick('/logout')}>
                  Logout
                </span>
              </li> : 
              <li className="nav-item">
                <span className="nav-link header-font" to="" onClick={() => handleNavLinkClick('/login')}>
                  Login
                </span>
              </li>}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;