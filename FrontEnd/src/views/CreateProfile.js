import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create an Axios instance with a base URL and credentials
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true,
});

// Component for creating a user profile
const CreateProfile = () => {
  // Retrieve current user information from local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navigate = useNavigate();

  // State to manage the user profile form data
    const [profile, setProfile] = useState({
        firstname: '',
        lastname: '',
        email: currentUser.data.email,
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
        skills_level_1: [],
        skills_level_2: [],
    });

    // State to manage form errors
    const [errors, setErrors] = useState({});

    // Update local storage whenever profile changes
    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(profile));
    }, [profile]);

    // Handle input changes for form fields
const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

        // Add a validation or modification for URL fields
        if (['github', 'linkedin', 'portfolio_url'].includes(name)) {
        const formattedValue = formatUrl(value);
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: formattedValue,
        }));
        } else {
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: type === 'checkbox' ? checked : value,
        }));
        }
    };
    
    // Function to format URLs
    const formatUrl = (url) => {
        // Check if the URL starts with http://www or https://www, if not, add it
        if (!url.startsWith('http://www') && !url.startsWith('https://www')) {
        if (url.startsWith('www')) {
            // If the URL starts with www, add http://
            return `http://${url}`;
        } else {
            // Otherwise, add http://www
            return `http://www.${url}`;
        }
        }
        return url;
    };

    // Handle avatar file change
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

    // Handle availability checkbox change
    const handleAvailabilityChange = (event) => {
        const { name, checked } = event.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: checked }));
    };

  // Handle the profile creation process
    const createProfile = async (e) => {
        e.preventDefault();
        try {
        // Validation
            const validationErrors = {};
            if (!profile.firstname) validationErrors.firstname = 'First name is required';
            if (!profile.lastname) validationErrors.lastname = 'Last name is required';
            if (!profile.intro_text) validationErrors.intro_text = 'Introduction is required';
            if (!profile.years_of_experience) validationErrors.years_of_experience = 'Years of Experience is required';
            if (!profile.location) validationErrors.location = 'Location is required';
            if (profile.available && !profile.date_available) validationErrors.date_available = 'Date Available is required';

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            // Clear previous errors
            setErrors({});

            const formData = new FormData();

            // Append avatar file to the form data if available
            if (profile.avatar) {
                formData.append('avatar', profile.avatar, 'avatar.jpg');
            }

            // Append other profile fields to the form data
            Object.entries(profile).forEach(([key, value]) => {
                if (key !== 'avatar') {
                formData.append(key, value);
                }
            });

            // Configuration for the API request, including authorization header
            const config = {
                headers: {
                'Content-Type': 'multipart/form-data', // This line is needed for file uploads
                Authorization: `Bearer ${currentUser.data.token}`,
                },
            };

            // Make a POST request to update the user profile
            const response = await api.post('users/update_profile/', formData, config);

            console.log('Profile updated:', response.data);
            navigate('/add-skills'); // Redirect to the next step
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

            {/* Profile creation form */}
                <form encType="multipart/form-data">
                    {/* Personal Information section */}
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
                            {errors.firstname && (
                                <div className='text-danger'>{errors.firstname}</div>
                            )}
                            <label className='fw-bold fs-5'>Last Name:</label>
                            <input
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                type='text'
                                name='lastname'
                                placeholder='Enter last name'
                                onChange={handleInputChange}
                            />
                            {errors.lastname && (
                                <div className='text-danger'>{errors.lastname}</div>
                            )}
                            <label className='fw-bold fs-5'>GitHub URL:</label>
                            <input
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                type='text'
                                name='github'
                                placeholder='Enter GitHub URL'
                                onChange={handleInputChange}
                            />
                            {errors.github && (
                                <div className='text-danger'>{errors.github}</div>
                            )}
                            <label className='fw-bold fs-5'>LinkedIn URL:</label>
                            <input
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                type='text'
                                name='linkedin'
                                placeholder='Enter LinkedIn URL'
                                onChange={handleInputChange}
                            />
                            {errors.linkedin && (
                                <div className='text-danger'>{errors.linkedin}</div>
                            )}
                            <label className='fw-bold fs-5'>Portfolio Site URL:</label>
                            <input
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                type='text'
                                name='portfolio_url'
                                placeholder='Enter Portfolio Site URL'
                                onChange={handleInputChange}
                            />
                            {errors.portfolio_url && (
                                <div className='text-danger'>{errors.portfolio_url}</div>
                            )}
                            <label className='fw-bold fs-5'>Introduction:</label>
                            <textarea
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                name='intro_text'
                                placeholder='Give a brief introduction to attract clients'
                                onChange={handleInputChange}
                            />
                            {errors.intro_text && (
                                <div className='text-danger'>{errors.intro_text}</div>
                            )}
                            <label className='fw-bold fs-5'>Bio:</label>
                            <textarea
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                name='biography_text'
                                placeholder='Enter a more detailed bio here, include anything you would want potential clients to know'
                                onChange={handleInputChange}
                            />
                            {errors.biography_text && (
                            <div className='text-danger'>{errors.biography_text}</div>
                            )}
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

                    {/* Professional Information section */}
                    <div className='col-md-5 mb-3'>
                        <div className='glass-box border-dark m-3 p-3'>
                        <h4 className='nasa text-uppercase'>Professional Information</h4>
                        <div className='mb-3'>
                            <label className='fw-bold fs-5'>Years of Experience:</label>
                            <input
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                type='text'
                                name='years_of_experience'
                                placeholder='Enter years of experience'
                                onChange={handleInputChange}
                            />
                            {errors.years_of_experience && (
                                <div className='text-danger'>{errors.years_of_experience}</div>
                            )}
                            <label className='form-label fw-bold fs-5'>Location:</label>
                            <input
                                className="form-control text-center hand-writing"
                                type='text'
                                name='location'
                                placeholder='Enter location'
                            onChange={handleInputChange}
                            />
                            {errors.location && (
                                <div className='text-danger'>{errors.location}</div>
                            )}
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
                            {errors.available && (
                                <div className='text-danger'>{errors.available}</div>
                            )}
                            <br />
                            <label className='form-label fw-bold fs-5 mt-2'>Date Available:</label>
                            <input
                                className="form-control text-center hand-writing"
                                type='date'
                                name='date_available'
                                value={profile.date_available}
                                onChange={handleInputChange}
                            />
                            {errors.date_available && (
                                <div className='text-danger'>{errors.date_available}</div>
                            )}
                        </div>
                        </div>
                    </div>
                    </div>
                    {/* Button to submit the form */}
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