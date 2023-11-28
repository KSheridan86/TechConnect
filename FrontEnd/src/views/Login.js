import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAnimation } from '../components/AnimationContext';


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

const Login = ({ onLogin }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [transition, setTransition] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);
  const navigate = useNavigate();
  const { shouldAnimate, setShouldAnimate } = useAnimation();

  useEffect(() => {
    if (shouldAnimate) {
      setShouldSlideOut(true);
      setTimeout(() => {
        setShouldSlideOut(false);
    }, 1000);
    }
  }, [shouldAnimate, setShouldAnimate, navigate]);

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

  const validateLoginDetails = () => {
    let isValid = true;
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Please enter your username";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Please enter your password";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Validate login details
    if (!validateLoginDetails()) {
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await api.post('users/login/', {
        'username': username.toLowerCase(),
        'password': password,
      }, config);
      const currentUser = response;
      // Store user details in local storage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      onLogin();
      setShouldSlideOut(true);

      const displayMessage = () => {
          if (currentUser.data.account_type === 'Developer') {
            setMessage('');
            setTimeout(() => {
              setTransition(true)
              setTimeout(() => {
                  navigate('/profile');
              }, 1000);
            }, 1750);
        } else {
            setMessage('');
            setTimeout(() => {
              setTransition(true)
              setTimeout(() => {
                navigate('/developers');
              }, 1000);
            }, 1750);
        }
      }
      setTimeout(() => {
        setSuccessMessage(true)
        displayMessage();
      }, 1000);
    } catch (error) {
      setMessage('');
      setErrors({ general: "Whoops, looks like there's an issue with your login details. Please try again." });
    }
    setTimeout(() => {
      setErrors({});
    }, 3000);
  };

  const handleSignUp = (accountType) => {
    navigate("/signup", { state: { accountType } });
  };

  if (!notAllowed) {
  return (
    <div className="container login mt-4 fill-screen main-content">
      <div style={{ height: "70px" }} className="d-none d-lg-block"></div>
      {!successMessage ? (
      <div className='row'>
        <div className={`col-md-6 ${shouldSlideOut ? 'animate-slide-out-left' : 'animate-slide-left'}`}>
          {errors.general && (
            <div className='notification-overlay fs-3'>
              <div className='alert alert-danger' role='alert'>
                {errors.general}
              </div>
            </div>
          )}
          {message && (
            <div className='notification-overlay fs-3'>
              <div className='alert alert-success' role='alert'>
                {message}
              </div>
            </div>
          )}
          <form className="glass-box m-3 mb-3 text-center" onSubmit={handleLogin}>
            <p className="fs-5 mt-3 mb-2">Welcome back to</p>
            <h2 className="header-font mt-2 text-center text-uppercase">
              TechConnect
            </h2>
            <div className="d-flex justify-content-center align-items-center">
              <div className="row p-3">
                <div className="col-12">
                  <input
                    className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                    type="email"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errors.username && (
                    <div className="text-danger">{errors.username}</div>
                  )}
                  <br></br>
                  <input
                    className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <div className="text-danger">{errors.password}</div>
                  )}
                </div>
                <br></br>
                <div className="col-12 text-center hand-writing">
                  <button
                    className="btn btn-warning border-dark border-2 mt-3 col-6 mb-4"
                    type="submit"
                    onClick={handleLogin}>
                    Login
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className={`col-md-6 hand-writing ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-right'}`}>
          <div className="glass-box m-3 fw-bold p-3 text-center">
            <p className="fs-5">Don't have an account yet?</p>
            <p>Are you a Developer looking to showcase your talents or find work? <br /> Sign up here!</p>
            <button
              className="btn btn-warning border-dark border-2 mt-1 col-6 mb-4"
              onClick={() => handleSignUp('Developer')}>
              New Dev Account
            </button>
            <p>If you're looking to hire the perfect talent for your latest project <br /> Sign up here!</p>
            <button
              className="btn btn-warning border-dark border-2 mt-1 col-6 mb-4"
              onClick={() => handleSignUp('Client')}>New Client Account
            </button>
          </div>
        </div>
      </div>
      ) :
      <div 
        className={`row justify-content-center mt-5 header-font ${ transition ? 'fade-out' : 'fade-in'}`}> 
        <div className="col-5 mt-5 glass-box">
          <h2 className={`header-font mt-2 text-center text-uppercase fade-in p-3 m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
            Login Successful!
            <br />
            <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} className='fs-1' />
          </h2>
        </div>
      </div>
      }
    </div>
  ); 
  } else {
      return (
        <div className="container login mt-4 fill-screen main-content">
          <div style={{ height: "70px" }} className="d-none d-lg-block"></div>
          <div className={`row justify-content-center mt-5 header-font ${ transition ? 'fade-out' : 'fade-in'}`}> 
            <div className="col-5 mt-5 glass-box">
              <h2 className={`header-font mt-2 text-center text-uppercase fade-in p-3 m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
                Already Logged in!
                <br />
                <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} className='fs-1' />
              </h2>
            </div>
          </div>
        </div>
        )}
};

export default Login;