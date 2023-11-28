import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAnimation } from '../components/AnimationContext';

// Create a context for all images in the 'images' directory
const imageContext = require.context('../images/randomAvatars', false, /\.png$/);
const imageFileNames = imageContext.keys();

const getRandomImage = () => {
  const randomImageFileName = imageFileNames[Math.floor(Math.random() * imageFileNames.length)];
  return imageContext(randomImageFileName);
};

const Developers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false); 
  const { shouldAnimate, setShouldAnimate } = useAnimation();
  const baseAvatarUrl = 'http://127.0.0.1:8000';
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldAnimate) {
      setShouldSlideOut(true);
      setTimeout(() => {
        setShouldSlideOut(false);
      }, 1000);
    }
  }, [shouldAnimate, setShouldAnimate, navigate]);

  const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true,
  });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('users/');
        setUsers(data);
    } catch (error) {
      setErrors({
        general: 
        "Whoops, looks like there's a problem accessing user details. Please try again later." });
        setTimeout(() => {
          setErrors({});
          navigate('/');
        }, 5000);
      }
  };

  useEffect(() => {
    fetchUsers();
    // empty array left here to prevent the api call from being made repeatedly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    // Filter users based on the search term
    const filteredUsers = users.filter((user) =>
      Object.values(user).some(
        (value) => typeof value === 'string' && 
        value.toLowerCase().includes(searchTerm.toLowerCase())
      ) || ['firstname', 'lastname', 'location', 'skills_level_1', 'skills_level_2'].some(
        (field) =>
          typeof user.profile !== 'undefined' &&
          typeof user.profile[field] === 'string' &&
          user.profile[field].toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    );

    // Update the state with the filtered users
    setFilteredUsers(filteredUsers);
    setSearchButtonClicked(true);
    console.log(filteredUsers)
    setTimeout(() => {
    // Scroll to the container with search results
      const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }, 750);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchButtonClicked(false); // Reset search button click when user starts typing
  };

  const handleUserClick = (userId) => {
    // Use navigate to go to the profile page and pass user.id as state
    setShouldSlideOut(true);
      setTimeout(() => {
        navigate(`/profile`, { state: { userId } });
      }, 1000);
  };
  // console.log(users)
  return (
    <div className="container mt-4 fill-screen">
      <div className="row justify-content-center">
      {errors.general && (
      <div className='notification-overlay fs-3'>
        <div className='alert alert-danger' role='alert'>
          {errors.general}
        </div>
      </div>
      )}
        <div className={`col-10 col-md-5 glass-box p-2 mt-3 text-center max ${shouldSlideOut ? 'animate-slide-out-left' : 'animate-slide-left'}`}>
          <h1 className="fw-bold p-2 text-center header-font text-uppercase">Discover Talented Developers!</h1>
          <p className="p-2">
            Looking for the right developer for your project?
            <br />
            You're in the right place!
            <br />
            Explore a diverse pool of talented
            individuals with expertise in various technologies and experience levels.
          </p>
          <hr />
          <p className="hand-writing fs-4 text-center mb-3">
            Simply input your particular criteria below and we'll do the rest!
          </p>
          <div className="row justify-content-center text-center">
            <div className="col-8">
              <input
                className="text-center border border-dark border-2 p-2 form-control mb-3 hand-writing"
                type="text"
                placeholder="Who or What are you looking for?"
                value={searchTerm}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-8 text-center hand-writing">
              <button
                className="btn btn-warning border-dark border-2 mt-3 col-6"
                onClick={handleSearch}>
                  Search
              </button>
            </div>
          </div>
        </div>
        <div className={`col-12 col-md-6 max mb-5 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-right'}`}>
          <div className="glass-box m-3 text-center">
            <div className="p-3">
              <p className="fs-3 mb-2 header-font text-uppercase">Searching made easy!</p>
              <div className="fs-5 mt-2 mb-1 header-font">Name</div>
              <p>
                Have a specific developer in mind?
                Search their name to quickly find their profile and portfolio.
              </p>
              <hr />
              <div className="fs-5 mt-3 mb-1 header-font">Tech Stack</div>
              <p>
                Use our technology stack filter to discover developers who specialize in
                what you need.
              </p>
              <hr />
              <div className="fs-5 mt-3 mb-1 header-font">Experience</div>
              <p>
                Find developers with the right level of experience for your project,
                whether you're looking for seasoned veterans or fresh talent.
              </p>
              <hr />
              <div className="fs-5 mt-3 mb-1 header-font">Location</div>
              <p>
                Prefer to work with developers in your area or time zone?
                Our location filter helps you narrow down your search.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* New container for the filtered user list */}
      <div id="resultsContainer" className="row justify-content-center mt-3">
        <div className="col-10 text-center max animate-slide-left">
          <div className="row">
          {searchButtonClicked && searchTerm && filteredUsers.length === 0 ? (
            <p className="col">Sorry, that search returned no results!</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`col-12 col-md-3 mb-3 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}
                onClick={() => handleUserClick(user.user)}
              >
                <div className="glass-box p-1">
                  {/* <img className="randomAvatar mt-2 mb-2" src={getRandomImage()} alt="Random Avatar 1" /> */}
                  {user.avatar ? (
                    <img className="randomAvatar rounded mt-2 mb-2" src={`${baseAvatarUrl}${user.avatar}`}  alt={user.avatar} />
                    ) : (
                    <img className="randomAvatar mt-2 mb-2" src={getRandomImage()} alt="Random Avatar 1" />
                  )}
                    <br />
                    <span className="header-font">{user.firstname}</span>
                    <span className="header-font"> {user.lastname}</span><br />
                    <span className="common-font">{user.location}</span>
                    <hr />
                    <span>Available: </span> <br />
                    <span className="header-font">{user.date_available}</span>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </div>
      <div style={{ height: "100px" }}></div>
    </div>
  );
};

export default Developers;