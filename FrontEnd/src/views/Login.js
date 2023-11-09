import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
    
  const handleLogin = async (e) => {
    e.preventDefault();

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
      if(currentUser.data.account_type === 'Developer') {
        navigate('/profile');
      } else {
        navigate('/developers');
      }
    } catch (error) {
      setError("Whoops, looks like there's an issue with your login details. Please try again.");
      console.error('Error while making the API call:', error);
    }
    setTimeout(() => {
      setError('');
    }, 3000);
  }
    const handleSignUp = (accountType) => {
    navigate("/signup", { state: { accountType } });
}

  useEffect(() => {
    if (data !== null) {
      onLogin()
      navigate('/', { state: {data}})
    }
  }, [data, navigate, onLogin]);

  return (
    <div className="container login fill-screen">
      <div style={{ height: "70px" }} className="d-none d-lg-block"></div>
        <div className="row">

          <div className="col-md-6">
          {error && (
            <div className='notification-overlay'>
              <div className='alert alert-success' role='alert'>
                {error}
              </div>
            </div>
          )}
            <form className="glass-box m-3 mb-3 fw-bold text-center" onSubmit={handleLogin}>
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
                    <br></br>
                    <input
                      className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
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

          <div className="col-md-6 hand-writing">
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