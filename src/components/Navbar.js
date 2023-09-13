import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import '../App.css';
import Home from '../views/Home';
import Developers from '../views/Developers';
import Profile from '../views/Profile';
import SignUp from '../views/SignUp';
import DeleteUser from '../views/DeleteUser';
import Login from '../views/Login';
import Logout from '../views/Logout';
import ConfirmDelete from '../views/ConfirmDelete';
import EditProfile from '../views/EditProfile';
import CreateProfile from '../views/CreateProfile';
import CreateProfilePart2 from '../views/CreateProfilePart2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStream, faCodeFork } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ isLoggedIn, onLogin, onLogout }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light sticky-top text-uppercase">
        <div className="container">
          <Link className="navbar-brand nasa text-uppercase" to="/">
            <FontAwesomeIcon icon={faCodeFork} /> TechConnect
          </Link>
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
                <Link className="nav-link nasa" to="/" onClick={closeNav}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nasa" to="/developers" onClick={closeNav}>
                  Developers
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nasa" to="/profile" onClick={closeNav}>
                  Profile
                </Link>
              </li>
              { isLoggedIn ? 
                <li className="nav-item">
                  <Link className="nav-link nasa" to="/logout" onClick={closeNav}>
                    Logout
                  </Link>
                </li> : 
                <li className="nav-item">
                  <Link className="nav-link nasa" to="/login" onClick={closeNav}>
                    Login
                  </Link>
                </li>}
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home loggedIn={isLoggedIn} />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<SignUp onLogin={onLogin} />} />
        <Route path="/delete-user" element={<DeleteUser onLogout={onLogout} />} />
        <Route path="/login" element={<Login onLogin={onLogin} />} /> 
        <Route path="/logout" element={<Logout onLogout={onLogout} />} />
        <Route path="/confirm-delete/:id" element={<ConfirmDelete />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/create-profile-part2" element={<CreateProfilePart2 />} />
      </Routes>
    </Router>
  );
};

export default Navbar;
