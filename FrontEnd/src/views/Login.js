import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedShouldSlideOut = JSON.parse(localStorage.getItem('shouldSlideOut'));
    if (storedShouldSlideOut) {
      // console.log('storedShouldSlideOut:', storedShouldSlideOut);
      // setShouldSlideOut(true);
      // console.log('shouldSlideOut:', shouldSlideOut);
      setTimeout(() => {
        localStorage.removeItem('shouldSlideOut');
      }, 1000);
      const check = JSON.parse(localStorage.getItem('shouldSlideOut'));
      console.log('storedShouldSlideOut:', check);
    }
  }, []);

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

      // Handle the response as needed
      setData(response.data);
      const currentUser = response;

      // Store user details in local storage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      onLogin();

      if (data !== null) {
        onLogin();
      }

      if (currentUser.data.account_type === 'Developer') {
          setMessage('');
          setShouldSlideOut(true);
          setTimeout(() => {
            navigate('/profile');
          }, 1000); 
          
      } else {
          setMessage('');
          setShouldSlideOut(true);
          setTimeout(() => {
            navigate('/developers');
          }, 1000); 
      }

    } catch (error) {
      setMessage('');
      console.error('Error while making the API call:', error);
      setErrors({ general: "Whoops, looks like there's an issue with your login details. Please try again." });
    }
    setTimeout(() => {
      setErrors({});
    }, 3000);
  };

  const handleSignUp = (accountType) => {
    navigate("/signup", { state: { accountType } });
  };

  return (
    <div className="container login fill-screen main-content">
      <div style={{ height: "70px" }} className="d-none d-lg-block"></div>
      <div className="row">

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
            <h2 className="nasa mt-2 text-center text-uppercase">
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
    </div>
  );
};

export default Login;