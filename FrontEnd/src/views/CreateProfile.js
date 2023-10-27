import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://16.171.133.35:4000', // Replace with the actual base URL of your Rails API
    withCredentials: true,
});

const CreateProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      intro: '',
      bio: '',
      avatar: '',
      location: '',
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
      yearsExperience: '',
      available: false,
    });

    const handleInputChange = event => {
        const { name, value } = event.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    const handleAvatarChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfile((prevProfile) => ({
            ...prevProfile,
            avatar: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    const handleAvailabilityChange = (event) => {
      const { name, checked } = event.target;
      setProfile((prevProfile) => ({ ...prevProfile, [name]: checked }));
    };

    const createProfile = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const users = JSON.parse(localStorage.getItem('Users'));
      // Find the current user in the Users array
      const updatedUsers = users.map((user) => {
      if (user.username === currentUser.username) {
            user.profile = profile; // Update the user's profile
          }
          return user;
      });
      localStorage.setItem('Users', JSON.stringify(updatedUsers));
            
      navigate("/add-skills");
    };
    

    return (
      <div className='container fill-screen'>
        <div className='row justify-content-center login'>
          <div className='col-12'>
            <h2 className='nasa-black text-center text-uppercase mt-3'>
              Create your Profile
            </h2>

            <form>
              <div className='row justify-content-evenly text-center'>
                <div className='col-md-5 mb-3'>
                  <div className='glass-box border-dark m-3 p-3'>
                    <h4 className="nasa text-uppercase">Personal Information</h4>
                    <div className='mb-3'>
                      <label className='fw-bold fs-5'>First Name:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='firstName'
                        placeholder='Enter first name'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Last Name:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='lastName'
                        placeholder='Enter last name'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Introduction:</label>
                      <textarea
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        name='intro'
                        placeholder='Give a brief introduction to attract clients'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Bio:</label>
                      <textarea
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        name='bio'
                        placeholder='Enter a more detailed bio here, include anything you would want potential clients to know'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Avatar (Upload Image):</label>
                      <input
                        className='border border-dark border-2 p-2 form-control mb-4 hand-writing'
                        type='file'
                        accept='image/*'
                        onChange={(event) => handleAvatarChange(event)}
                      />
                      {profile.avatar && (
                        <div>
                          <img src={profile.avatar} alt='Avatar Preview' width='100' height='100' />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='col-md-5 mb-3'>
                  <div className='glass-box border-dark m-3 p-3'>
                    <h4 className="nasa text-uppercase">Professional Information</h4>
                    <div className='mb-3'>
                      <label className='fw-bold fs-5'>GitHub URL:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='githubUrl'
                        placeholder='Enter GitHub URL'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>LinkedIn URL:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='linkedinUrl'
                        placeholder='Enter LinkedIn URL'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Portfolio Site URL:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='portfolioUrl'
                        placeholder='Enter Portfolio Site URL'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Years of Experience:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='yearsExperience'
                        placeholder='Enter years of experience'
                        onChange={handleInputChange}
                      />
                      <label className='form-label fw-bold fs-5'>Location:</label>
                      <input
                        className="form-control text-center hand-writing"
                        type='text'
                        name='location'
                        placeholder='Enter location'
                        onChange={handleInputChange}
                      />
                      <label className='form-label fw-bold fs-5 mt-2'>Available:</label>
                      <br />
                      <small>Check this box if you are available for work</small>
                      <br />
                      <input
                        className='form-check-input mt-2'
                        type='checkbox'
                        name='available'
                        checked={profile.available}
                        onChange={handleAvailabilityChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='text-center'>
                <button
                  type='submit'
                  className='btn btn-warning btn-lg'
                  onClick={createProfile}
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        <div style={{ height: '9rem' }}></div>
      </div>
    </div>
    );
};

export default CreateProfile;