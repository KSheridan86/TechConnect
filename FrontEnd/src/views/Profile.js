import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import defaultAvatar from '../images/default-avatar.png';
import axios from 'axios';
import { useAnimation } from '../components/AnimationContext';

// Create an Axios instance with a base URL and credentials
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Component to display and manage user profile
const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [projects, setProjects] = useState([]);
  const [foundUser, setFoundUser] = useState({}); 
  const baseAvatarUrl = 'http://127.0.0.1:8000';
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const { shouldAnimate, setShouldAnimate } = useAnimation();
  const [confirmation, setConfirmation] = useState(false);
  const [fadeButton, setFadeButton] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (shouldAnimate) {
        setShouldSlideOut(true);
        setTimeout(() => {
          setShouldSlideOut(false);
        }, 1000);
    }
  }, [shouldAnimate, setShouldAnimate, navigate]);

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Configuration for the API request, including authorization header
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        // Make a GET request to retrieve the user profile and set variables
        const profileId = location.state?.userId || currentUser?.data.id;

        if (profileId) {
          const response = await api.get(`users/profile/${profileId}`, config);
          setFoundUser(response.data);
          setProjects(response.data.projects);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Handle the error if needed
      }
    };
    fetchProfileData();
    // empty array left here to prevent the api call from being made repeatedly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.userId]);
  
  // Functions to navigate to the 'Add Skills' and 'Add Projects pages
  const updateSkills = () => {
    localStorage.setItem('userProfile', JSON.stringify(foundUser));
    setShouldSlideOut(true);
    setTimeout(() => {
      navigate('/add-skills', { state: { returnUrl: '/profile' } });
    }, 1000);
  };

  const addProjects = () => {
    setShouldSlideOut(true);
    setTimeout(() => {
      navigate('/add-projects', { state: { returnUrl: '/profile' } });
    }, 1000);
  };

  const confirmDelete = () => {
    setFadeButton(true);
    setTimeout(() => {
      setConfirmation(true);
    }, 1000);
  }

  const cancelDelete = () => {
    setFadeButton(false);
    setTimeout(() => {
      setConfirmation(false);
    }, 1000);
  }

  // Function to delete all skills for the current user
  const deleteSkills = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.data.token}`,
        },
      };

      setFadeButton(false);
      setTimeout(() => {
        setConfirmation(false);
        // Make a request to the API endpoint to delete skills
        api.post('users/update_profile/', { delete_skills: true }, config)
          .then(() => {
          // Update the state to reflect the changes (set skills to an empty array)
            setFoundUser((prevUser) => ({
              ...prevUser,
              skills_level_1: [],
              skills_level_2: [],
            }
          ));
        })
      }, 1000);
    } catch (error) {
      console.error('Error deleting skills:', error);
      // Handle the error if needed
    }
  };

  // Function to update the user profile
  const updateProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(foundUser));
    const retrievedProfile = JSON.parse(localStorage.getItem('userProfile'));
    console.log(retrievedProfile)
    setShouldSlideOut(true);
      setTimeout(() => {
        navigate('/update-profile');
      }, 1000); 
  };

  const handleProjectLinkClick = (project) => {
    setShouldSlideOut(true);
    setTimeout(() => {
      navigate(`/project/${project.id}`, { state: { project } });
    }, 1000);
  };

  const isSkillsDefinedAndNotEmpty =
    foundUser.skills_level_1 &&
    foundUser.skills_level_1.length > 0 &&
    !(foundUser.skills_level_1.length === 2 &&
      foundUser.skills_level_1[0] === "(''," &&
      foundUser.skills_level_1[1] === ')');

  return (
    <div className='container mt-4 fill-screen mb-2'>
      <div className='row justify-content-evenly'>
      {currentUser ? ( // Conditionally render content only if currentUser exists
        <h2 className={`nasa-black text-center text-uppercase mt-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
          {foundUser.email === currentUser.data.email && (
          <p className="nasa">
            Hello {currentUser.data.username}, Welcome back!
          </p>      
          )}
        </h2>
      ) : null}
        <div className={`col-md-6 col-10 col-lg-5 glass-box mb-5 ${shouldSlideOut ? 'animate-slide-out-top' : 'animate-slide-top'}`}>
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-7">
                {foundUser && foundUser.avatar ? (
                  <img
                    src={`${baseAvatarUrl}${foundUser.avatar}`}
                    alt='User Avatar'
                    className='user-avatar mt-2 rounded'
                  />
                ) : (
                  <img
                    src={defaultAvatar}
                    alt='User Avatar'
                    className='user-avatar mt-2 rounded'
                  />
                )}
                </div>
                <div className="col-5 mt-3">
                {foundUser && (
                <div>
                  {foundUser.firstname && (
                  <p className='nasa-black text-center text-uppercase'>
                    {`${foundUser.firstname} ${foundUser.lastname}`}
                  </p>
                  )}
                  {foundUser.location && (
                  <p className='nasa-black text-center text-uppercase'>
                    {`Location: ${foundUser.location}`}
                  </p>
                  )}
                  {foundUser.years_of_experience && (
                  <p className='nasa-black text-center text-uppercase'>
                    {`Y.O.E: ${foundUser.years_of_experience}`}
                  </p>
                  )}
                  {foundUser.github && (
                  <p className='nasa-black text-center text-uppercase'>
                    <a href={foundUser.github} 
                      className="profile-link" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      GitHub Profile
                    </a>
                  </p>
                  )}
                  {foundUser.linkedin && (
                  <p className='nasa-black text-center text-uppercase'>
                    <a href={foundUser.linkedin} 
                      className="profile-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn Profile
                    </a>
                  </p>
                  )}
                  {foundUser.portfolio_url && (
                  <p className='nasa-black text-center text-uppercase'>
                    <a href={foundUser.portfolio_url} 
                      className="profile-link" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Portfolio
                    </a>
                  </p>
                  )}
                  {foundUser.available && foundUser.date_available && (
                  <p className='nasa-black text-center text-uppercase'>
                    {`Available from: ${foundUser.date_available}`}
                  </p>
                  )}
                  {!foundUser.available && (
                  <p className='nasa-black text-center text-uppercase'>Not Available</p>
                  )}
                </div>
                )}
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-3">
            {foundUser && (
              <div>
                <p className='nasa-black text-center text-uppercase'>
                  <a href={`mailto:${foundUser.email}`} className="email-link">{foundUser.email}</a>
                </p>
                <p className='nasa-black text-center text-uppercase p-3'>
                  Introduction: <br />{` ${foundUser.intro_text || 'Not provided'}`}
                </p>
                <p className='nasa-black text-center text-uppercase p-3'>
                  Biography: <br />{` ${foundUser.biography_text || 'Not provided'}`}
                </p>
              </div>
            )}
            </div>
          </div>

          <h2 className='nasa-black text-center text-uppercase mt-1'>Skills</h2>
          {isSkillsDefinedAndNotEmpty ? (
          <div>
          {foundUser.skills_level_1 && (
            <div>
              <h5 className='nasa-black text-center text-uppercase mt-3'>Level 1 Skills:</h5>
              <p className='nasa-black text-center mt-3'>
                {Array.isArray(foundUser.skills_level_1)
                  ? foundUser.skills_level_1
                    .filter(skill => typeof skill === 'string' && /[a-zA-Z]/.test(skill)) // Check if the element contains letters
                    .filter(skill => !/\(\)|^\s*$/.test(skill)) // Check if the element is not '()' or contains only whitespaces
                    .map(skill => capitalizeFirstLetter(skill.trim())).join(', ')
                  : foundUser.skills_level_1
                }
              </p>
            </div>
          )}
            <h5 className='nasa-black text-center text-uppercase mt-3'>Level 2 Skills:</h5>
            {foundUser.skills_level_2 && (
            <p className='nasa-black text-center mt-3'>
              {Array.isArray(foundUser.skills_level_2)
                ? foundUser.skills_level_2
                  .filter(skill => typeof skill === 'string' && /[a-zA-Z]/.test(skill)) // Check if the element contains letters
                  .filter(skill => !/\(\)|^\s*$/.test(skill)) // Check if the element is not '()' or contains only whitespaces
                  .map(skill => capitalizeFirstLetter(skill.trim())).join(', ')
                : foundUser.skills_level_2
              }
            </p>
            )}
            </div>) : 
            <div className='nasa-black text-center text-uppercase mt-3 mb-3'>
              You have no saved skills, add some below to show off how great you are!
            </div>}
            {currentUser ? (
            <div>
            {foundUser.email === currentUser.data.email && (
              <div className="text-center hand-writing">
                {/* Conditionally render different buttons as confirmation of DELETE action */}
                {confirmation ? ( 
                <div className={`${fadeButton ? 'fade-in' : 'fade-out'}`}>
                  <button
                    className='btn btn-warning btn-lg mb-4 mx-2'
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='btn btn-danger btn-lg mb-4 mx-2'
                    onClick={deleteSkills}
                  >
                    Confirm
                  </button> 
                  <p className="text-danger fw-bold">This will delete all your skills??</p>
                </div> ) : (
                <div className={`${fadeButton ? 'fade-out' : 'fade-in'}`}>
                  <button
                    className='btn btn-warning btn-lg mb-4 mx-2'
                    onClick={updateSkills}
                  >
                    Add Skills
                  </button>
                  <button
                    type='button'
                    className='btn btn-danger btn-lg mb-4 mx-2'
                    onClick={confirmDelete}
                    >
                    Delete Skills
                  </button>
                </div> ) }
              </div>
          )}</div>) : (null) } 
        </div>

        <div className={`col-md-6 col-10 col-lg-5 glass-box mb-5 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}>
          <div className="project-container mt-3">
            <h3 className='nasa-black text-center text-uppercase mt-3'>Your Projects:</h3>
            {projects && projects.length > 0 && (
              <div>
                {projects.map((project, index) => (
                  <div className="project-box glass-box w-75 m-auto mb-3" key={index}>
                    <Link to="#" 
                      key={index} 
                      className="project-link"
                      onClick={() => handleProjectLinkClick(project)}
                    >
                    {project.image && (
                    <img
                      src={`${baseAvatarUrl}${project.image}`}
                      alt={`Project ${project.name}`}
                      className='project-image rounded m-auto'
                      style={{ display: 'block' }} 
                    />
                    )}
                    <p className='nasa-black text-center text-uppercase mt-1'>{project.name}</p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          {currentUser ? (
          <div className='text-center mt-5 mb-5 hand-writing'>
            {foundUser.email === currentUser.data.email && (
            <button
              className='btn btn-warning btn-lg mx-2'
              onClick={addProjects}
            >
              Add Projects
            </button> )}
          </div> ) : (null) }
        </div>
        {currentUser ? (
        <div className='text-center mt-2 mb-1 hand-writing'>
          {foundUser.email === currentUser.data.email && (
          <button
            className={`btn btn-warning btn-lg mx-2 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}
            onClick={updateProfile}
          >
            Edit Profile
          </button>
          )}
        </div>
        ) : (null) }
        <div style={{ height: '8rem' }}></div>
      </div>
    </div>
  );
};

export default Profile;