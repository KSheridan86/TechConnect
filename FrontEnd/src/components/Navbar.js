import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAnimation } from '../components/AnimationContext';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStream, faCodeFork, faEnvelope, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ isLoggedIn, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShouldAnimate } = useAnimation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const unreadMessagesCount = JSON.parse(localStorage.getItem('unreadMessagesCount'));

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  console.log(currentUser)
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
    setTimeout(() => {
      setShouldAnimate(false);
      navigate('/profile', { state: { fromNavbar: true } });
    }, 1000);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top text-uppercase">
      <div className="container-fluid">
        {currentUser ? (
          <span className="navbar-brand header-font text-uppercase mx-0 mx-md-5"
          onClick={() => handleNavLinkClick('/inbox')}>
            {unreadMessagesCount > 0 ? (
            <>
              <FontAwesomeIcon icon={faEnvelopeOpen} />
              <div className="unread-count border border-dark">{unreadMessagesCount}</div>
            </>
            ) : (
            <FontAwesomeIcon icon={faEnvelope} />
            )}
          </span>
        ) : (null)}
        <span className={`navbar-brand header-font text-uppercase m-2 ${currentUser ? '' : 'mx-5'}`} to="" onClick={() => handleNavLinkClick('/')} >
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
          <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <span className="nav-link header-font m-2" to="" onClick={() => handleNavLinkClick('/')}>
                Home
              </span>
            </li>
            <li className={`nav-item ${location.pathname === '/developers' ? 'active' : ''}`}>
              <span className="nav-link header-font m-2" to="" onClick={() => handleNavLinkClick('/developers')}>
                Developers
              </span>
            </li>
            {currentUser && currentUser.data.account_type === "Developer" && currentUser.profile?.detail !== "Profile deleted successfully." && (
              <li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                {currentUser ? (
                  <span className="nav-link header-font m-2" onClick={() => userProfileClick()}>
                  Profile
                </span>
                ) : (
                  <span className="nav-link header-font m-2" onClick={() => handleNavLinkClick('/profile')}>
                    Profile
                  </span>
                )}
              </li>
            )}
            {currentUser ? 
              <li className={`nav-item ${location.pathname === '/logout' ? 'active' : ''}`}>
                <span className="nav-link header-font m-2" to="" onClick={() => handleNavLinkClick('/logout')}>
                  Logout
                </span>
              </li> : 
              <li className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
                <span className="nav-link header-font m-2" to="" onClick={() => handleNavLinkClick('/login')}>
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