// Profile.js
import React, { useState, useEffect } from 'react';
// import axios from 'axios';

const Profile = () => {
  // Step 2: Create a state variable to store user data
  const [userData, setUserData] = useState({});

  useEffect(() => {
      // Step 3: Retrieve data from local storage and update the state
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const users = JSON.parse(localStorage.getItem('Users'));

      // Find the current user in the Users array
      const foundUser = users.find(user => user.username === currentUser.username);

      if (foundUser) {
          setUserData(foundUser);
      }
  }, []);


  return (
    <div className='container mt-4'>
            <div className='row justify-content-center login'>
                <div className='col-12 glass-box'>
                    <h2 className='nasa-black text-center text-uppercase mt-3'>
                    Hello {userData.username}, Welcome back!
                    </h2>
                    <p className='nasa-black text-center text-uppercase mt-3'>{userData.accountType}</p>
                    <p className='nasa-black text-center text-uppercase mt-3'>{userData.email}</p>
                    <p className='nasa-black text-center text-uppercase mt-3'>
                      Your current skills are: {userData.skills[0]}, {userData.skills[1]} & 
                      {userData.skills[2]}. 
                    </p>
            </div>
            <div style={{ height: '35rem' }}></div>
        </div>
        </div>
  );
};

export default Profile;
