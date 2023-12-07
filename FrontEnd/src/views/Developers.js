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
  const [showAvailableDevs, setShowAvailableDevs] = useState(false);
  const [searchType, setSearchType] = useState('regular');
  const { shouldAnimate, setShouldAnimate } = useAnimation();
  const baseAvatarUrl = 'http://127.0.0.1:8000';
  const navigate = useNavigate();
  const [experienceFilter, setExperienceFilter] = useState('all');

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
      const usersWithSkills = await Promise.all(
        data.map(async (user) => {
          // Assuming user.skills_1 and user.skills_2 are arrays of skill IDs
          const skillsDetails1 = await Promise.all(
            user.skills_1.map(async (skillId) => {
              try {
                const skillResponse = await api.get(`users/skills/${skillId}/`);
                return skillResponse.data.name;
              } catch (error) {
                console.error('Error fetching skill details:', error);
                return null;
              }
            })
          );
  
          const skillsDetails2 = await Promise.all(
            user.skills_2.map(async (skillId) => {
              try {
                const skillResponse = await api.get(`users/skills/${skillId}/`);
                return skillResponse.data.name;
              } catch (error) {
                console.error('Error fetching skill details:', error);
                return null;
              }
            })
          );
  
          return {
            ...user,
            currentSkills1: skillsDetails1.join(', '),
            currentSkills2: skillsDetails2.join(', '),
          };
        })
      );
  
      setUsers(usersWithSkills);
    } catch (error) {
      setErrors({
        general:
          "Whoops, looks like there's a problem accessing user details. Please try again later.",
      });
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
    const meetsExperienceCriteria = (user) => {
      const userExperience = user.years_of_experience;

      switch (experienceFilter) {
        case 'lessThan2':
          return userExperience <= 2;
        case '3to5':
          return userExperience >= 3 && userExperience <= 5;
        case '6to9':
          return userExperience >= 6 && userExperience <= 9;
        case '10andAbove':
          return userExperience >= 10;
        default:
          return true; // Default case, no experience filter applied
      }
    };
    // Filter users based on the search term and search type
    const filteredUsers = users.filter((user) => {
      if (searchType === 'regular') {
        // For regular search, use existing logic
        return (
          Object.values(user).some(
            (value) =>
              typeof value === 'string' &&
              value.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          ['firstname', 'lastname', 'location'].some(
            (field) =>
              typeof user.profile !== 'undefined' &&
              typeof user.profile[field] === 'string' &&
              user.profile[field].toLowerCase().includes(searchTerm.toLowerCase())
          )
        ) && (!showAvailableDevs || (user.available && user.date_available));
      } else if (searchType === 'skills') {
        // For skill search, check against currentSkills1 and currentSkills2
        return (
          user.currentSkills1.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.currentSkills2.toLowerCase().includes(searchTerm.toLowerCase())
        ) && (!showAvailableDevs || (user.available && user.date_available));
      }
      return false;
    });

    const filteredUsersWithExperience = filteredUsers.filter((user) => meetsExperienceCriteria(user));

  
    // Update the state with the filtered users
    setFilteredUsers(filteredUsersWithExperience);
    setSearchButtonClicked(true);
  
    // Scroll to the container with search results
    setTimeout(() => {
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
    <div className="container mt-4">
      <div className="row justify-content-evenly">
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
                className="fw-bold border border-dark border-2 p-2 form-control mb-3 hand-writing"
                type="text"
                placeholder="Who or What are you looking for?"
                value={searchTerm}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-8 text-center hand-writing">
              <select
                className="form-select mb-3"
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="regular">Search by Name/Location</option>
                <option value="skills">Search by Tech Stack</option>
              </select>
            </div>

            <div className="col-8 text-center hand-writing">
          <select
            className="form-select mb-3"
            onChange={(e) => setExperienceFilter(e.target.value)} // Updated state on change
          >
            <option value="all">All Experience</option>
            <option value="lessThan2">Less than 2 years</option>
            <option value="3to5">3 - 5 years</option>
            <option value="6to9">6 - 9 years</option>
            <option value="10andAbove">10+ years</option>
          </select>
        </div>

            <div className="col-5 text-center hand-writing">
              <div className="form-check">
              <label className="form-check-label" htmlFor="showAvailableDevs">
                  Only show available devs?
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showAvailableDevs"
                  checked={showAvailableDevs}
                  onChange={() => setShowAvailableDevs(!showAvailableDevs)}
                />
               
              </div>
            </div>
            <div className="col-8 text-center hand-writing">
              <button
                className="btn btn-warning border-dark border-2 mt-3 col-6"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className={`col-12 col-md-6 max mb-5 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-right'}`}>
          <div className="glass-box m-3 text-center">
            <div className="p-3">
              <p className="fs-1 mb-4 header-font text-uppercase">Searching made easy!</p>
              <div className="fs-5 mt-2 mb-1 header-font">Name</div>
              <p className='p-2'>
                Have a specific developer in mind?
                Search their name to quickly find their profile and portfolio.
              </p>
              <hr />
              <div className="fs-5 mt-3 mb-1 header-font">Tech Stack</div>
              <p className='p-2'>
                Use our technology stack filter to discover developers who specialize in
                what you need.
              </p>
              <hr />
              <div className="fs-5 mt-3 mb-1 header-font">Experience</div>
              <p className='p-2'>
                Find developers with the right level of experience for your project,
                whether you're looking for seasoned veterans or fresh talent.
              </p>
              <hr />
              <div className="fs-5 mt-3 mb-1 header-font">Location</div>
              <p className='p-2'>
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
            <span className="glass-box p-3 header-font">Sorry, that search returned no results!</span>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`col-12 col-md-3 mb-3 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}
                onClick={() => handleUserClick(user.user)}
              >
                <div className="glass-box p-1 dev-box">
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
                    {user.available ? (
                      <div>
                        <span>I'm Available on: </span> <br />
                      <span className="header-font">{user.date_available}</span>
                      </div>
                    ) : (
                      <div>
                        <span>Unavailable: </span> <br />
                      <span className="header-font">Sorry</span>
                      </div>
                    )}<br />
                    
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </div>
      {/* <div style={{ height: "100px" }}></div> */}
    </div>
  );
};

export default Developers;