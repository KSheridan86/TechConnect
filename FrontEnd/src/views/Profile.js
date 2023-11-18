import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../images/default-avatar.png';
import axios from 'axios';

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
  const [userData, setUserData] = useState({ profile: {} });
  const [foundUser, setFoundUser] = useState({}); 
  const baseAvatarUrl = 'http://127.0.0.1:8000';
  const navigate = useNavigate();

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Configuration for the API request, including authorization header
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.data.token}`,
          },
        };
        // Make a GET request to retrieve the user profile and set variables
        const response = await api.get('users/profile/', config);
        
        await setFoundUser(response.data);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Handle the error if needed
      }
    };
    fetchProfileData();
  }, []);

   // Functions to navigate to the 'Add Skills' and 'Add Projects pages
  const updateSkills = () => {
    navigate('/add-skills', { state: { returnUrl: '/profile' } });
  };

  const addProjects = () => {
    navigate('/add-projects', { state: { returnUrl: '/profile' } });
  };

  // const deleteAllSkills = () => {
  //   // Find the current user in the Users array
  //   const updatedUsers = users.map((user) => {
  //     if (user.email === currentUser.email) {
  //       user.skills = []; // Set skills array to an empty array
  //     }
  //     return user;
  //   });

  //   localStorage.setItem('Users', JSON.stringify(updatedUsers));

  //   // Update the userData state to reflect the changes
  //   setUserData((prevUserData) => ({
  //     ...prevUserData,
  //     skills: [],
  //   }));
  // };

  // const handleDeleteProject = (indexToDelete) => {
  //   const updatedProjectsList = [...userData.projectsList];
  //   // Remove the project at the specified index
  //   updatedProjectsList.splice(indexToDelete, 1);
  //   // Update the user's projectsList in local storage
  //   const updatedUserData = { ...userData, projectsList: updatedProjectsList };
  //   // const updatedUsers = users.map(user => {
  //   //     if (user.username === currentUser.username) {
  //   //         return updatedUserData;
  //   //     }
  //   //     return user;
  //   //     });
  //   // localStorage.setItem('Users', JSON.stringify(updatedUsers));
  //   // Update the state to reflect the changes
  //   setUserData(updatedUserData);
  // };
  // console.log(userData.profile.githubUrl)
  
  return (
    <div className='container mt-4 fill-screen mb-2'>
      <div className='row justify-content-evenly'>
        <h2 className='nasa-black text-center text-uppercase mt-3'>
          Hello {currentUser.data.username}, Welcome back!
        </h2>
        <div className='col-10 col-lg-5 glass-box mb-5 animate-slide-left'>
          <div className="row">
            <div className="col-6">
                <img
                  src={foundUser && foundUser.avatar ? `${baseAvatarUrl}${foundUser.avatar}` : defaultAvatar}
                  alt='User Avatar'
                  className='user-avatar mt-2'
                />
            </div>
            <div className="col-6 mt-3">
              <p className='nasa-black text-center text-uppercase'>{currentUser.data.username}</p>
              <p className='nasa-black text-center text-uppercase'>{currentUser.data.email}</p>
              <p className='nasa-black text-center text-uppercase'>{foundUser.github}</p>
              <p className='nasa-black text-center text-uppercase'>{foundUser.linkedin}</p>
              <p className='nasa-black text-center text-uppercase'>{foundUser.location}</p>
              {foundUser.available === true ? (
                <p className='nasa-black text-center text-uppercase'>Available for work on <br />{foundUser.date_available}</p>
                
              ) : (
                <p className='nasa-black text-center text-uppercase'>Not Available</p>
              )}
            </div>
          </div>
        
          <h3 className='nasa-black text-center text-uppercase mt-3'>Your level 1 Skills:</h3>
          {foundUser.skills_level_1 && (
              <p className='nasa-black text-center mt-3'>
                {Array.isArray(foundUser.skills_level_1)
                    ? foundUser.skills_level_1
                        .filter(skill => typeof skill === 'string')
                        .map(skill => capitalizeFirstLetter(skill.trim()))
                        .join(', ')
                    : foundUser.skills_level_1
                }
              </p>
          )}

          <h3 className='nasa-black text-center text-uppercase mt-3'>Your level 2 Skills:</h3>
          {foundUser.skills_level_2 && (
              <p className='nasa-black text-center mt-3'>
              {Array.isArray(foundUser.skills_level_2)
                  ? foundUser.skills_level_2
                      .filter(skill => typeof skill === 'string')
                      .map(skill => capitalizeFirstLetter(skill.trim()))
                      .join(', ')
                  : foundUser.skills_level_2
              }
          </p>
          )}
          {foundUser.email === currentUser.data.email && (
            <div className="text-center hand-writing">
              <button
                type='button'
                className='btn btn-danger btn-lg mb-4'
                // onClick={deleteAllSkills}
                >
                Delete All Skills
              </button>
            </div>
          )}
          
        </div>
        <div className='col-10 col-lg-5 glass-box mb-5 animate-slide-right'>
          {userData.projectsList && userData.projectsList.length > 0 && (
          <div>
            <h3 className='nasa-black text-center text-uppercase mt-3'>Your Projects:</h3>
                      
              {userData.projectsList.map((project, index) => (
                <div className="glass-box w-75 m-auto mb-3">
                  <p className='nasa-black text-center text-uppercase mt-3' key={index}>
                  {project.name}
                  </p>
                  <p className='nasa-black text-center text-uppercase mt-3' key={index}>
                  {project.description}
                  </p>
                  <p className='nasa-black text-center text-uppercase mt-3' key={index}>
                  {project.techStack}
                  </p>
                  <p className='nasa-black text-center text-uppercase mt-3' key={index}>
                  {project.siteUrl}
                  </p>
                  <p className='nasa-black text-center text-uppercase mt-3' key={index}>
                  {project.repoUrl}
                  </p>
                  {currentUser.email === foundUser.email && (
                    <div className='text-center hand-writing'>
                        <button
                            type='button'
                            className='btn btn-danger btn-sm mb-3'
                            // onClick={() => handleDeleteProject(index)}
                              >
                            Delete Project
                        </button>
                    </div>
                )}
                </div>
          ))}
          </div>
          )}
        </div>

        <div className='text-center mt-5 mb-5 hand-writing'>
            <button
              className='btn btn-warning btn-lg mx-2'
              onClick={updateSkills}
            >
              Add Skills
            </button>
            <button
              className='btn btn-warning btn-lg mx-2'
              onClick={addProjects}
            >
              Add Projects
            </button>
          </div>
        <div style={{ height: '10rem' }}></div>
      </div>
    </div>
  );
};

export default Profile;
