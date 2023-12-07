import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faStar, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import defaultAvatar from '../images/default-avatar.png';
import defaultProject from '../images/win95.png';
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
  const [reviews, setReviews] = useState([]);
  const [foundUser, setFoundUser] = useState({}); 
  const [errors, setErrors] = useState({});
  const baseAvatarUrl = 'http://127.0.0.1:8000';
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const { shouldAnimate, setShouldAnimate } = useAnimation();
  const [confirmation, setConfirmation] = useState(false);
  const [confirmation2, setConfirmation2] = useState(false);
  const [fadeButton2, setFadeButton2] = useState(false);
  const [fadeButton, setFadeButton] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [transition, setTransition] = useState(false);
  const [skillsLevel1, setSkillsLevel1] = useState([]);
  const [skillsLevel2, setSkillsLevel2] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromNavbar = location?.state?.fromNavbar;
  const [dropdownStates, setDropdownStates] = useState({});
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [showBack, setShowBack] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

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
          setReviews(response.data.reviews);
          if (currentUser) {
            currentUser.profile = response.data;
          }
          
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          const skillIds_1 = response.data.skills_1;
          const skillIds_2 = response.data.skills_2;
          const skillsDetails_1 = await Promise.all(
              skillIds_1.map(async (id) => {
                  try {
                      const skillResponse = await api.get(`users/skills/${id}/`);
                      return skillResponse.data.name;
                  } catch (error) {
                      console.error('Error fetching skill details:', error);
                      return null;
                  }
              })
          );
          setSkillsLevel1(skillsDetails_1);
          const skillsDetails_2 = await Promise.all(
            skillIds_2.map(async (id) => {
                try {
                    const skillResponse = await api.get(`users/skills/${id}/`);
                    return skillResponse.data.name;
                } catch (error) {
                    console.error('Error fetching skill details:', error);
                    return null;
                }
            })
        );
          setSkillsLevel2(skillsDetails_2);
        }
        
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setErrors({ 
          general: 
          "Whoops, looks like there's a problem gathering your profile details. Please try again later." });
        if (errors){
          setTimeout(() => {
            setErrors('');
            navigate('/');
          }, 3000);
        }
      }
    };
    fetchProfileData();
    // empty array left here to prevent the api call from being made repeatedly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromNavbar]);

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

  const confirmSkillsDelete = () => {
    setFadeButton(true);
    setTimeout(() => {
      setConfirmation(true);
    }, 1000);
  }

  const confirmProfileDelete = () => {
    setFadeButton2(true);
    setTimeout(() => {
      setConfirmation2(true);
    }, 1000);
  }

  const cancelSkillsDelete = () => {
    setFadeButton(false);
    setTimeout(() => {
      setConfirmation(false);
    }, 1000);
  }

  const cancelProfileDelete = () => {
    setFadeButton2(false);
    setTimeout(() => {
      setConfirmation2(false);
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
          setSkillsLevel1([]);
          setSkillsLevel2([]);
      }, 1000);
    } catch (error) {
      console.error('Error deleting skills:', error);
      // Handle the error if needed
      setErrors({ general: "Whoops, looks like there's an issue with your details. Please try again later." });
    }
  };

  // Function to update the user profile
  const updateProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(foundUser));
    const retrievedProfile = JSON.parse(localStorage.getItem('userProfile'));
    setShouldSlideOut(true);
      setTimeout(() => {
        navigate('/update-profile');
      }, 1000); 
  };

  const handleProjectLinkClick = (project) => {
    setShouldSlideOut(true);
    setTimeout(() => {
      navigate(`/project/${project.id}`, { state: { projectId: project.id } });
    }, 1000);
  };

  const deleteProfile = async (profileId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.data.token}`,
        },
      };
  
      const response = await api.delete(`users/delete-profile/${foundUser.id}/`, config);
  
      const displayMessage = () => {
        setTimeout(() => {
          setTransition(true);
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }, 1750);
      };
  
      if (response) {
        setShouldSlideOut(true);
        setTimeout(() => {
          setSuccessMessage(true);
          displayMessage();
        }, 1000);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const isSkillsDefinedAndNotEmpty =
    foundUser.skills_1 &&
    foundUser.skills_1.length > 0;  

  const toggleDropdown = useCallback((reviewId) => {
    setDropdownStates((prevStates) => {
      setExpandedReviewId((prevId) => (prevId === reviewId ? null : reviewId));
      // Close all open dropdowns
      const updatedStates = Object.fromEntries(
        Object.entries(prevStates).map(([id, isOpen]) => [id, false])
      );
  
      // Toggle the state for the clicked review
      updatedStates[reviewId] = !prevStates[reviewId];
  
      return updatedStates;
    });
  }, []);

  const handleLeaveReviewClick = () => {
    setSubmittingReview(false);
    setShowBack(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const gradientColors = ['#FF0000', '#FF4500', '#FF8C00', '#FFEC8B', '#FFD700'];
    const starColor = gradientColors[rating - 1];

    for (let i = 0; i < rating; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} style={{ color: starColor }} />);
    }
    return stars;
  };

  const handleStarClick = (starValue) => {
    // Update the selected rating when a star is clicked
    setSelectedRating(starValue);
  };

  const validateReviewForm = () => {
    let isValid = true;
    const newErrors = {};

    const reviewText = document.getElementById('reviewText').value;
    const rating = selectedRating;

    if (!reviewText.trim()) {
      newErrors.reviewText = "Please enter your review";
      isValid = false;
    }

    if (!rating || rating === 0) {
      newErrors.rating = "Please enter a rating";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate review form details
    if (!validateReviewForm()) {
      // Handle validation errors
      return;
    }

    // setSubmittingReview(true);

    const reviewText = document.getElementById('reviewText').value;
    // const rating = document.getElementById('rating').value;
    const recommended = document.getElementById('recommended').checked;
    // const recommendedCheckbox = document.getElementById('recommended');
    // console.log('Checkbox Value:', recommendedCheckbox.checked);

    try {
      const reviewData = {
        reviewer: currentUser.data.id,
        reviewee: foundUser.id, // Assuming `foundUser.user` is the DeveloperProfile instance
        review: reviewText,
        recommended: recommended,
        rating: parseInt(selectedRating),
      };
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.data.token}`,
        },
      };
  
      const response = await api.post('users/submit-review/', reviewData, config);
  
      // Assuming your backend returns the created review object
      const newReview = response.data;
  
      // Update the reviews state to include the new review
      setReviews((prevReviews) => [newReview, ...prevReviews]);
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ general: "Whoops, looks like there's an issue with your review. Please try again later." });
      setTimeout(() => {
        setErrors({});
      }, 3000);
      // Handle the error if needed
    } finally {
      // Reset the submittingReview state
      setSubmittingReview(true);
      setTimeout(() => {
        setShowBack(false);
      }, 750);
    }
  };

  const sendMessage = () => {
    setShouldSlideOut(true);
    localStorage.setItem('profile', JSON.stringify(foundUser));
    setTimeout(() => {
      navigate('/send-message');
    }, 1000);
  }

  return (
    <div className='container mt-4 fill-screen mb-2'>
      {!successMessage ? (
            <div className='row justify-content-evenly'>
            <div>
            {errors.general && (
                    <div className='notification-overlay fs-3'>
                        <div className='alert alert-success' role='alert'>
                        {errors.general}
                        </div>
                    </div>
                )}
            </div>
          
          {currentUser ? ( // Conditionally render content only if currentUser exists
            <h2 className={`header-font text-center text-uppercase mt-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
              {foundUser.email === currentUser.data.email && (
              <p className="header-font">
                Hello {currentUser.data.username}, Welcome back!
              </p>      
              )}
            </h2>
          ) : null}
            <div className={`col-md-6 col-10 col-lg-5 glass-box mb-5 ${shouldSlideOut ? 'animate-slide-out-top' : 'animate-slide-top'}`}>
              <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-7 text-center">
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
                    <div>
                      {currentUser ? (
                      <button 
                        className='btn btn-warning mt-2 mb-2 mx-2'
                        onClick={sendMessage}>
                          Send Message
                      </button>
                      ) : (null)}
                      
                    </div>
                    
                    </div>
                    <div className="col-5 mt-3">
                    {foundUser && (
                    <div>
                      {foundUser.firstname && (
                      <p className='header-font text-center text-uppercase'>
                        {`${foundUser.firstname} ${foundUser.lastname}`}
                      </p>
                      )}
                      {foundUser.location && (
                      <p className="header-font text-center text-uppercase">
                        {`Location: ${foundUser.location}`}
                      </p>
                      )}
                      {foundUser.years_of_experience && (
                      <p className='header-font text-center text-uppercase'>
                        {`Yrs Exp: ${foundUser.years_of_experience}`}
                      </p>
                      )}
                      {foundUser.github && (
                      <p className='header-font text-center text-uppercase'>
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
                      <p className='header-font text-center text-uppercase'>
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
                      <p className='header-font text-center text-uppercase'>
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
                      <p className='header-font text-center text-uppercase'>
                        {`Available from: ${foundUser.date_available}`}
                      </p>
                      )}
                      {!foundUser.available && (
                      <p className='header-font text-center text-uppercase'>Not Available</p>
                      )}
                    </div>
                    )}
                    </div>
                  </div>
                </div>
    
                <div className="col-md-12 mt-3">
                {foundUser && (
                  <div>
                    { currentUser ? (
                    <p className='header-font text-center text-uppercase'>
                      <a href={`mailto:${foundUser.email}`} className="email-link">{foundUser.email}</a>
                    </p>
                    ) : (null)}
                    
                    <p className='header-font text-center text-uppercase p-3'>
                      Introduction: <br />{` ${foundUser.intro_text || 'Not provided'}`}
                    </p>
                    <p className='header-font text-center text-uppercase p-3'>
                      Biography: <br />{` ${foundUser.biography_text || 'Not provided'}`}
                    </p>
                  </div>
                )}
                </div>
              </div>
    
              <h2 className='header-font text-center text-uppercase mt-1'>Skills</h2>
              {isSkillsDefinedAndNotEmpty ? (
              <div>
              {skillsLevel1 && (
                <div>
                  <h5 className='header-font text-center text-uppercase mt-3'>Level 1 Skills:</h5>
                  <p className='header-font text-center mt-3'>
                    {skillsLevel1
                      .filter(skill => typeof skill === 'string' && /[a-zA-Z]/.test(skill)) // Check if the element contains letters
                      .filter(skill => !/\(\)|^\s*$/.test(skill)) // Check if the element is not '()' or contains only whitespaces
                      .map(skill => capitalizeFirstLetter(skill.trim()))
                      .join(', ')
                    }
                  </p>
                </div>
              )}
              {skillsLevel2 && (
                <div>
                  <h5 className='header-font text-center text-uppercase mt-3'>Level 2 Skills:</h5>
                  <p className='header-font text-center mt-3'>
                    {skillsLevel2
                      .filter(skill => typeof skill === 'string' && /[a-zA-Z]/.test(skill)) // Check if the element contains letters
                      .filter(skill => !/\(\)|^\s*$/.test(skill)) // Check if the element is not '()' or contains only whitespaces
                      .map(skill => capitalizeFirstLetter(skill.trim()))
                      .join(', ')
                    }
                  </p>
                </div>
              )}
              </div>) : 
                <div className='header-font text-center text-uppercase mt-3 mb-3'>
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
                        onClick={cancelSkillsDelete}
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
                        onClick={confirmSkillsDelete}
                        >
                        Delete Skills
                      </button>
                    </div> ) }
                  </div>
              )}</div>) : (null) } 
            </div>
    
            <div className={`col-md-6 col-10 col-lg-5 glass-box mb-5 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}>
              <div className="project-container mt-3">
                <h3 className='header-font text-center text-uppercase mt-3'>Your Projects:</h3>
                {projects && projects.length > 0 && (
                  <div>
                    {projects.map((project, index) => (
                      <div className="project-box glass-box w-75 m-auto mb-3" key={index}>
                        <Link to="#" 
                          key={index} 
                          className="project-link"
                          onClick={() => handleProjectLinkClick(project)}
                        >
                        {project.image ? (
                        <img
                          src={`${baseAvatarUrl}${project.image}`}
                          alt={`Project ${project.name}`}
                          className='project-image rounded m-auto'
                          style={{ display: 'block' }} 
                        />
                        ) : (
                          <img
                          src={defaultProject}
                          alt={`Project ${project.name}`}
                          className='project-image rounded m-auto'
                          style={{ display: 'block' }} 
                        />
                        )}
                        <p className='header-font text-center text-uppercase mt-1'>{project.name}</p>
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

             {/* REview Section */}
            <div className={`row justify-content-center mt-2 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}>
              <div className="glass-box col-8">
                <h3 className="m-1 p-1 header-font text-center">Testimonials</h3>
              </div>


              <div className={`col-10 col-md-8 col-lg-6 mt-2 fade-in glass-box ${showBack ? 'flip' : ''}`}>
              {showBack ? (
                  // Back of the div with the form
                  <div className="review-form text-center flip-back form-in">
                  
                  <form className={`${submittingReview ? 'fade-out' : ''}`}>
                  <h5 className='header-font text-center text-uppercase mt-4'>Leave a Review</h5>
                    <div className="mb-3">
                      <label htmlFor="reviewText" className="form-label">
                      </label>
                      <textarea
                        id="reviewText"
                        className="form-control w-75 m-auto"
                        rows="3"
                        placeholder="Enter your review..."
                      ></textarea>
                      {errors.reviewText && (
                        <div className="text-danger">{errors.reviewText}</div>
                      )}
                    </div>
                    <div className="mb-3">
                    <h5 className='header-font text-center text-uppercase mt-4'>How would you rate me?</h5>

                    <div id="rating" className="star-rating">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <FontAwesomeIcon
                          key={value}
                          icon={faStar}
                          className={`star ${value <= selectedRating ? 'filled' : ''}`}
                          onClick={() => handleStarClick(value)}
                        />
                      ))}
                    </div>
                    {errors.rating && (
                      <div className="text-danger">{errors.rating}</div>
                    )}

                    </div>
                    <div className="mb-3 form-check">
                      <h5 className='header-font text-uppercase mt-3'>Would you recommend me?</h5>
                      <div className="form-check d-inline-block">
                        <label className="form-check-label" htmlFor="recommended">
                        </label>
                        <input type="checkbox" className="form-check-input fs-4" id="recommended" />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary m-auto mt-3"
                      onClick={handleFormSubmit}
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
                ) : (
                reviews.map((review) => (
                  <div key={review.id} className="mb-3 mt-3 text-center review-container fade-in">
                    <div className="text-center">
                    <button 
                      className='form-label header-font btn btn-success btn-lg mt-2 w-75 d-flex justify-content-between align-items-center m-auto' 
                      onClick={() => toggleDropdown(review.id)}>
                        {review.reviewer_name}
                        <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '5px' }} />
                    </button>
                    </div>
                    {dropdownStates[review.id] ? (
                    <div className={`review-details mt-2 border-dark rounded ${
                      expandedReviewId === review.id ? 'slide-up' : 'slide-down'
                    }`}>
                    <p>{review.review}</p>
                    <p>{renderStars(review.rating)}</p>
                    <div>
             
                    <div>{review.recommended === true ? (
                      <div className="">
                        <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} className='fs-1' />
                        <p className="hand-writing">Recommended</p>
                      </div>
                        ) : (
                          <div className="">
                           <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} className='fs-2' />
                          <p className="hand-writing">Not Recommended</p>
                        </div>
                        )}
                    </div>
            
                        </div>
                    {/* {currentUser?.data.email === foundUser?.email ? (
                      <p className='fs-4'>
                      <FontAwesomeIcon 
                        icon={faTimesCircle} 
                        style={{
                          color: 'red',
                          cursor: 'pointer',
                        }} 
                      // onClick={() => handleDeleteReview(review.id)}
                        />
                        <br />Delete
                    </p>
                      ) : (null)} */}
                      
                  </div>
                    ) : (
                      <div>
                        <p>{renderStars(review.rating)}</p>
                      </div>
                    )}
                  </div>
                )))}
                <div>
                  {currentUser ? (
                  <button
                    className={`btn btn-warning btn-lg mt-4 mb-4 w-50 d-flex justify-content-center align-items-center m-auto ${showBack ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}
                    onClick={handleLeaveReviewClick}
                  >
                    Leave Review
                  </button>
                  ) : (null)}
                </div>
                
              </div>
            </div>

            {currentUser ? (
            <div className='text-center mt-2 mb-1 hand-writing'>
              {foundUser.email === currentUser.data.email && (
              <div>
                {confirmation2 ? (
                <div className={`${fadeButton2 ? 'fade-in' : 'fade-out'}`}>
                  <button
                    className={`btn btn-warning btn-lg mx-2 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}
                    onClick={cancelProfileDelete}
                  >
                  Cancel
                  </button>
                  <button
                    className={`btn btn-danger btn-lg mx-2 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}
                    onClick={deleteProfile}
                  >
                  Confirm
                  </button>
                  <p className="glass-box text-danger fw-bold mt-2 fs-5 col-6 m-auto">
                    This will permanently delete your profile!
                  </p>
                </div>
                ) : (
                <div className={`${fadeButton2 ? 'fade-out' : 'fade-in'}`}>
                  <button
                    className={`btn btn-warning btn-lg mx-2 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}
                    onClick={updateProfile}
                  >
                  Edit Profile
                  </button>
                  <button
                    className={`btn btn-danger btn-lg mx-2 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}
                    onClick={confirmProfileDelete}
                  >
                  Delete Profile
                  </button>
                </div>
                )}
              </div>
              )}
            </div>
            ) : (null) }
            <div style={{ height: '8rem' }}></div>
          </div>
      ) : (
        <div className={`row justify-content-center mt-5 header-font ${ transition ? 'fade-out' : 'fade-in'}`}> 
        <div className="col-5 mt-5 glass-box">
            <h2 className={`header-font mt-2 text-center text-uppercase fade-in p-3 m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
                Profile Deleted!
                <br />
                <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} className='fs-1' />
            </h2>
        </div>
    </div>
      )}
  
    </div>
  );
};

export default Profile;


