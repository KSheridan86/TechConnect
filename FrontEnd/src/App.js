import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
import { AnimationProvider } from './components/AnimationContext';
import Home from './views/Home';
import Developers from './views/Developers';
import Profile from './views/Profile';
import SignUp from './views/SignUp';
import DeleteUser from './views/DeleteUser';
import Login from './views/Login';
import Logout from './views/Logout';
import ConfirmDelete from './views/ConfirmDelete';
import EditProfile from './views/EditProfile';
import CreateProfile from './views/CreateProfile';
import AddSkills from './views/AddSkills';
import AddProjects from './views/AddProjects';
import ProjectDetail from './views/ProjectDetail';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if UserData exists in local storage and keep the user logged in
    const storedUserData = JSON.parse(localStorage.getItem('UserData'));
    if (storedUserData) {
      handleLogin();
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    // Remove all of the users data from local storage
    localStorage.clear();
  };

  return (
    <AnimationProvider>
      <Router>
        <Navbar isLoggedIn={loggedIn} onLogin={handleLogin} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home loggedIn={loggedIn} />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
          <Route path="/delete-user" element={<DeleteUser onLogout={handleLogout} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          <Route path="/confirm-delete/:id" element={<ConfirmDelete />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/add-skills" element={<AddSkills />} />
          <Route path="/add-projects" element={<AddProjects />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
        </Routes>
        <BackToTop />
        <Footer />
      </Router>
    </AnimationProvider>
  );
}

export default App;