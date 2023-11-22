import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Create an Axios instance with a base URL and credentials
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true,
});

// Component for adding skills to the user's profile
const AddSkills = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const returnUrl = location.state ? location.state.returnUrl : null;
    const [errors, setErrors] = useState({});
    const [shouldSlideOut, setShouldSlideOut] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [transition, setTransition] = useState(false);

    // State variables to manage user input for primary and secondary skills
    const [primarySkills, setPrimarySkills] = useState('');
    const [secondarySkills, setSecondarySkills] = useState('');

    // State variables to store the user's current primary and secondary skills
    const [currentSkills1, setCurrentSkills1] = useState([]);
    const [currentSkills2, setCurrentSkills2] = useState([]);

    const validateSkills = () => {
        let isValid = true;
        const newErrors = {};
    
        if (!primarySkills.trim() && !secondarySkills.trim()) {
            newErrors.primarySkills = 'Please enter at least one skill in any class of skills';
            newErrors.secondarySkills = 'Please enter at least one skill in any class of skills';
            isValid = false;
        }
    
        setErrors(newErrors);
        return isValid;
    };

    // Fetch current skills when the component mounts
    useEffect(() => {
        const fetchSkills = async () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${currentUser.data.token}`,
                    },};
                
                const response = await api.get('users/profile/', config);
                setCurrentSkills1(response.data.skills_level_1);
                setCurrentSkills2(response.data.skills_level_2);
            } catch (error) {
                console.error('Error fetching current skills:', error);
                setErrors({ general: "Whoops, we couldn't find your current skills, you have skills don't you??" });
            }
        };

        fetchSkills();
    }, []);

    // Handle the process of adding skills to the user's profile
    const addSkills = async (e) => {
        e.preventDefault();
        // Validate skills
        if (!validateSkills()) {
            return;
        }
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const formData = new FormData();

        // Function to join skills with commas
        const joinSkills = (skills) => (skills.length > 0 ? skills.join(', ') : '');

        // Create new arrays by adding the entered skills to the current skills
        const newSkills1 = [...currentSkills1, primarySkills];
        const newSkills2 = [...currentSkills2, secondarySkills];

        // Append skills to form data
        formData.append('skills_level_1', joinSkills(newSkills1));
        formData.append('skills_level_2', joinSkills(newSkills2));

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${currentUser.data.token}`,
                },
            };

            // Make a POST request to update the user profile with the new skills
            const response = await api.post('users/update_profile/', formData, config);


            const displayMessage = () => {
                // setMessage('');
                if (response && returnUrl) {
                  setTimeout(() => {
                    setTransition(true)
                    setTimeout(() => {
                        navigate('/profile');
                    }, 1000);
                  }, 1750);
              } else {
                  setTimeout(() => {
                    setTransition(true)
                    setTimeout(() => {
                      navigate('/add-projects');
                    }, 1000);
                  }, 1750);
              }
            }


            // Redirect to the appropriate page based on returnUrl or default to '/add-projects'
            if (response) {
                setShouldSlideOut(true);
                setTimeout(() => {
                    setSuccessMessage(true)
                    displayMessage();
                  }, 1000);
            }



        } catch (error) {
            console.error('Error updating profile with skills:', error);
            console.log('Error response from server:', error.response);
            setErrors({ general: "Whoops, we couldn't save your skills. Please try again later." });
        }
    };

    return (
        <div className='container mt-2 fill-screen'>

        {!successMessage ? (
            <div className='row justify-content-center login'>
                <div className='col-12 mb-5'>
                {errors.general && (
                    <div className='notification-overlay fs-3'>
                        <div className='alert alert-danger' role='alert'>
                            {errors.general}
                        </div>
                    </div>
                )}
                    
                    {/* Skills input form */}
                    <form>
                        
                        <div className='row justify-content-evenly text-center'>
                            <div className={`col-md-8 mb-0 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
                                
                            <div className='glass-box border-dark m-3 p-4'>
                                <h2 className='nasa-black text-center text-uppercase mt-2'>
                                    Add Skills to your Profile
                                </h2>
                                <div className='mb-3'>
                                <h4 className="fw-bold">Use this space to inform clients of your abilities, ie "React", "Python" etc...</h4>
                                <br />
                                <label style={{maxWidth: '75%'}} className='fw-bold mb-2'>Lets start with your primary skills, the ones you're most proficient and comfortable with.</label>
                                <textarea style={{maxWidth: '75%'}}
                                    className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing m-auto'
                                    name='skills_level_1'
                                    placeholder='Add your PRIMARY skills here separated by commas'
                                    onChange={(e) => setPrimarySkills(e.target.value)}
                                    rows={1}
                                />
                                {errors.primarySkills && (
                                    <div className="text-danger">{errors.primarySkills}</div>
                                )}
                                <br />
                                <label style={{maxWidth: '75%'}} className='fw-bold mb-2'>Now add your secondary skills, skills you're familiar with but not a pro in.</label>
                                <textarea style={{maxWidth: '75%'}}
                                    className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing m-auto'
                                    name='skills_level_2'
                                    placeholder='Add your SECONDARY skills here separated by commas'
                                    onChange={(e) => setSecondarySkills(e.target.value)}
                                    rows={1}
                                />
                                {errors.secondarySkills && (
                                    <div className="text-danger">{errors.secondarySkills}</div>
                                )}
                                </div>
                            </div>
                            </div>
                        </div>
                        {/* Button to submit the form */}
                        <div className='text-center hand-writing mb-5'>
                            <button
                                type='button'
                                className={`btn btn-warning btn-lg ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}
                                onClick={addSkills}>
                                Add Skills
                            </button>
                            {returnUrl && (
                                <button
                                type='button'
                                className={`btn btn-warning btn-lg m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}
                                onClick={() => {
                                    setShouldSlideOut(true);
                                    setTimeout(() => {
                                        navigate("/profile");
                                    }, 1000);}}>
                                Back
                            </button>
                            )}
                            
                        </div>
                    </form>
                </div>
            </div>
            ) :
            <div className={`row justify-content-center mt-5 nasa-black ${ transition ? 'fade-out' : 'fade-in'}`}> 
              <div className="col-5 mt-5 glass-box">
                  <h2 className={`nasa mt-2 text-center text-uppercase fade-in p-3 m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
                    Skills Updated!
                    <br />
                    <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} className='fs-1' />
                  </h2>
              </div>
            </div>
              }
        </div>
    );
};

export default AddSkills;