import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

const SignUp = ({ onLogin }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const location = useLocation();
  const accountType = location.state?.accountType;
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [transition, setTransition] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);
  const initialUserData = {
    username: '',
    email: '',
    password: '',
    account_type: accountType,
  };

  const [userData, setUserData] = useState(initialUserData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));
    // Clear error message for the current field when user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

    // Check if user is already logged in
  const checkLoginStatus = async () => {
    let alreadyLoggedIn = currentUser;
    if (alreadyLoggedIn !== null) {
      setNotAllowed(true);
    }
  };
  useEffect(() => {
    checkLoginStatus();
    if (notAllowed) {
      setTimeout(() => {
        setTransition(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notAllowed]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate username
    if (!userData.username.trim()) {
      newErrors.username = "Please enter a username";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim() || !emailRegex.test(userData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate password
    if (!userData.password.trim()) {
      newErrors.password = "Please enter a password";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the form
    if (!validateForm()) {
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await api.post('users/register/', {
        account_type: userData.account_type,
        username: userData.username.toLowerCase(),
        email: userData.email,
        password: userData.password,
      }, config);
      if (response) {
        await loginAfterSignup();
      }
    } catch (error) {
      setErrors({ general: "Whoops, looks like there's an issue with your details. Please try again." });
      console.error('Failed to register user:', error);
    }
  };

  const loginAfterSignup = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await api.post('/users/login/', {
        username: userData.username.toLowerCase(),
        password: userData.password,
      }, config);
      const currentUser = response;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      onLogin();

      setShouldSlideOut(true);

      //  Redirect and start animation after 1.75 seconds
      const displayMessage = () => {
        // setMessage('');
        if (accountType === 'Developer') {
          setTimeout(() => {
            setTransition(true)
            setTimeout(() => {
                navigate('/create-profile');
            }, 1000);
          }, 1750);
        } else {
            setTimeout(() => {
              setTransition(true)
              setTimeout(() => {
                navigate('/developers');
              }, 1000);
            }, 1750);
        }
      }
    // Display success message, Call function to  and redirect after 1 second
      setTimeout(() => {
        setSuccessMessage(true)
        displayMessage();
      }, 1000);
  
    } catch (error) {
      console.error('Error logging in after signup:', error);
      setErrors({ general: "Whoops, we couldn't log you in. Please try again." });
    }

    if (errors){
      setTimeout(() => {
        setErrors('');
      }, 2500);
    }
  };

  if (!notAllowed) {

  return (
    <div className="container login fill-screen mt-4">

      {!successMessage ? (

      <div className="row mt-3 justify-content-center">
        <div className={`col-md-6 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
          {errors.general && (
            <div className='notification-overlay fs-3'>
              <div className='alert alert-success' role='alert'>
                {errors.general}
              </div>
            </div>
          )}
          <div className="glass-box border-dark m-3">
            <h2 className="nasa-black text-center text-uppercase mt-3">
              {accountType === "Developer" ? "Developer Sign Up" : "Client Sign up"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-center align-items-center">
                <div className="row">
                  <div className="col-12 text-center">
                    <label className="fw-bold fs-5">Username:</label>
                    <input
                      className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      onChange={handleInputChange}
                    />
                    {errors.username && (
                      <div className="text-danger">{errors.username}</div>
                    )}
                    <label className="fw-bold fs-5">Email:</label>
                    <input
                      className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <div className="text-danger">{errors.email}</div>
                    )}
                    <label className="fw-bold fs-5">Password:</label>
                    <input
                      className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      onChange={handleInputChange}
                    />
                    {errors.password && (
                      <div className="text-danger">{errors.password}</div>
                    )}
                    <br />
                  </div>
                  <br />
                </div>
              </div>
              <div className="col-12 text-center hand-writing">
                {accountType === "Developer" ? (
                  <button
                    type="submit"
                    className="btn btn-warning border-dark border-2 mt-3 mb-4 col-6"
                  >
                    Sign Up
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-warning border-dark border-2 mt-3 mb-4 col-6"
                  >
                    Sign Up
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      ) :
      <div className={`row justify-content-center mt-5 nasa-black ${ transition ? 'fade-out' : 'fade-in'}`}> 
        <div className="col-5 mt-5 glass-box">
            <h2 className={`nasa mt-2 text-center text-uppercase fade-in p-3 m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
              Account Created!
              <br />
              <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} className='fs-1' />
            </h2>
        </div>
      </div>
        }

    </div>
  ); } else {
    return (
      <div className="container login mt-4 fill-screen main-content">
        <div style={{ height: "70px" }} className="d-none d-lg-block"></div>
        <div className={`row justify-content-center mt-5 nasa-black ${ transition ? 'fade-out' : 'fade-in'}`}> 
          <div className="col-5 mt-5 glass-box">
            <h2 className={`nasa mt-2 text-center text-uppercase fade-in p-3 m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
              Already Registered and logged in!
              <br />
              <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} className='fs-1' />
            </h2>
          </div>
        </div>
      </div>
    )
  }
};

export default SignUp;