import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const users = JSON.parse(localStorage.getItem('Users'));
  const [userData, setUserData] = useState({});
  const [foundUser, setFoundUser] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
      // Find the current user in the Users array
      const found = users.find(user => user.email === currentUser.email);
      if (found) {
        setFoundUser(found);
        setUserData(found);
      }
  }
  , [currentUser.email, users]);

  const updateSkills = () => {
    navigate('/add-skills', { state: { returnUrl: '/profile' } });
  };

  const deleteAllSkills = () => {
    // Find the current user in the Users array
    const updatedUsers = users.map((user) => {
      if (user.email === currentUser.email) {
        user.skills = []; // Set skills array to an empty array
      }
      return user;
    });

    localStorage.setItem('Users', JSON.stringify(updatedUsers));

    // Update the userData state to reflect the changes
    setUserData((prevUserData) => ({
      ...prevUserData,
      skills: [],
    }));
  };

  const handleDeleteProject = (indexToDelete) => {
    const updatedProjectsList = [...userData.projectsList];
    // Remove the project at the specified index
    updatedProjectsList.splice(indexToDelete, 1);
    // Update the user's projectsList in local storage
    const updatedUserData = { ...userData, projectsList: updatedProjectsList };
    const updatedUsers = users.map(user => {
        if (user.username === currentUser.username) {
            return updatedUserData;
        }
        return user;
        });
    localStorage.setItem('Users', JSON.stringify(updatedUsers));
    // Update the state to reflect the changes
    setUserData(updatedUserData);
  };
  
  return (
    <div className='container mt-4 fill-screen mb-2'>
      <div className='row justify-content-center login'>
        <div className='col-12 glass-box mb-5'>
          <h2 className='nasa-black text-center text-uppercase mt-3'>
            Hello {userData.username}, Welcome back!
          </h2>
          <p className='nasa-black text-center text-uppercase mt-3'>{userData.accountType}</p>
          <p className='nasa-black text-center text-uppercase mt-3'>{userData.email}</p>
          
          <h3 className='nasa-black text-center text-uppercase mt-3'>Your Skills:</h3>
          
          {userData.skills && userData.skills.length > 0 && (
            <p className='nasa-black text-center text-uppercase mt-3'>
              {userData.skills.join(', ')}.
            </p>
          )}
          {userData.email === currentUser.email && (
            <div className="text-center hand-writing">
              <button
                type='button'
                className='btn btn-danger btn-lg'
                onClick={deleteAllSkills}>
                Delete All Skills
              </button>
            </div>
          )}
          {userData.projectsList && userData.projectsList.length > 0 && (
          <div>
            <h3 className='nasa-black text-center text-uppercase mt-3'>Your Projects:</h3>
                      
              {userData.projectsList.map((project, index) => (
                <div className="glass-box w-50 m-auto mb-3">
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
                            onClick={() => handleDeleteProject(index)}>
                            Delete Project
                        </button>
                    </div>
                )}
                </div>
          ))}
          </div>
          )}
          <div className='text-center mt-3 mb-5 hand-writing'>
            <button
              className='btn btn-warning btn-lg mx-2'
              onClick={updateSkills}
            >
              Add Skills
            </button>
            <button
              className='btn btn-warning btn-lg mx-2'
              onClick={() => navigate('/add-projects')}
            >
              Add Projects
            </button>
          </div>
          
        </div>
        <div style={{ height: '10rem' }}></div>
      </div>
    </div>
  );
};

export default Profile;
