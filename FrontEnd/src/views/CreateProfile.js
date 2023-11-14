import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

const CreateProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
      firstname: '',
      lastname: '',
      github: '',
      linkedin: '',
      portfolio_url: '',
      intro_text: '',
      biography_text: '',
      avatar: null,
      years_of_experience: '',
      location: '',
      available: false,
      date_available: '',
    });

    const handleInputChange = (event) => {
      const { name, value, type, checked } = event.target;
      
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };

    const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatar: file, // Store the file object directly
      }));
    };
    reader.readAsDataURL(file);
    }
  };

    const handleAvailabilityChange = (event) => {
      const { name, checked } = event.target;
      setProfile((prevProfile) => ({ ...prevProfile, [name]: checked }));
    };

    const createProfile = async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();

        if (profile.avatar) {
          formData.append('avatar', profile.avatar, 'avatar.jpg');
        }

        Object.entries(profile).forEach(([key, value]) => {
          if (key !== 'avatar') {
          formData.append(key, value);
          }
        });
        console.log("FormData Content:", formData);
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data', // This line is needed for file uploads
            Authorization: `Bearer ${currentUser.data.token}`,
          },
        };

        const response = await api.post('users/update_profile/', formData, config);
  
        console.log('Profile updated:', response.data);
        navigate('/profile');
      } catch (error) {
        console.error('Error updating profile:', error);
        console.log('Error response from server:', error.response); 
      }
    };
    

    return (
      <div className='container fill-screen'>
        <div className='row justify-content-center login'>
          <div className='col-12'>
            <h2 className='nasa-black text-center text-uppercase mt-3'>
              Create your Profile
            </h2>

            <form encType="multipart/form-data">
              <div className='row justify-content-evenly text-center'>
                <div className='col-md-5 mb-3'>
                  <div className='glass-box border-dark m-3 p-3'>
                    <h4 className="nasa text-uppercase">Personal Information</h4>
                    <div className='mb-3'>
                      <label className='fw-bold fs-5'>First Name:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='firstname'
                        placeholder='Enter first name'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Last Name:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='lastname'
                        placeholder='Enter last name'
                        onChange={handleInputChange}
                      />
                            location: '',
                            available: '',
                            date_available: '',
                      <label className='fw-bold fs-5'>GitHub URL:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='github'
                        placeholder='Enter GitHub URL'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>LinkedIn URL:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='linkedin'
                        placeholder='Enter LinkedIn URL'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Portfolio Site URL:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='portfolio_url'
                        placeholder='Enter Portfolio Site URL'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Introduction:</label>
                      <textarea
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        name='intro_text'
                        placeholder='Give a brief introduction to attract clients'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Bio:</label>
                      <textarea
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        name='biography_text'
                        placeholder='Enter a more detailed bio here, include anything you would want potential clients to know'
                        onChange={handleInputChange}
                      />
                      <label className='fw-bold fs-5'>Avatar (Upload Image):</label>
                      <input
                        className='border border-dark border-2 p-2 form-control mb-4 hand-writing'
                        name='avatar'
                        type='file'
                        accept='image/*'
                        onChange={(event) => handleAvatarChange(event)}
                      />
                      {profile.avatar && (
                        <div>
                          <img src={URL.createObjectURL(profile.avatar)} alt='Avatar Preview' width='100' height='100' />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='col-md-5 mb-3'>
                  <div className='glass-box border-dark m-3 p-3'>
                    <h4 className="nasa text-uppercase">Professional Information</h4>
                    <div className='mb-3'>
                      
                      
                      <label className='fw-bold fs-5'>Years of Experience:</label>
                      <input
                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        type='text'
                        name='years_of_experience'
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
                      <br />
                      <label className='form-label fw-bold fs-5 mt-2'>Date Available:</label>
                      <input
                        className="form-control text-center hand-writing"
                        type='date'
                        name='date_available'
                        value={profile.date_available}
                        onChange={handleInputChange}
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