import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true,
});

const SignUp = ({ onLogin }) => {
  const location = useLocation();
  const accountType = location.state?.accountType;
  const navigate = useNavigate();
  const initialUserData = {
          username: '',
          email: '',
          password: '',
          account_type: accountType,
        }

  const [userData, setUserData] = useState(initialUserData);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setUserData(prevUserData => ({ ...prevUserData, [name]: value }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
            const response = await api.post('users/register/', { 
              'account_type': userData.account_type,
              'username': userData.username.toLowerCase(),
              'email': userData.email,
              'password': userData.password,
              
            }, config);
            if (response) {
                // console.log('User registered successfully:', response.data);
            // Log the user in after signup
            await loginAfterSignup();
            }
        } catch (error) {
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
            'username': userData.username.toLowerCase(),
            'password': userData.password,
          }, config);
          const currentUser = response;
          // console.log('User logged in successfully:', response.data);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          onLogin();
        } catch (error) {
          console.error('Error logging in after signup:', error);
        }
      if (accountType === "Developer") {
          navigate('/create-profile');
      } else {
          navigate('/developers');
      }
    };

    return (
      <div className="container login fill-screen mt-4">
        <div className="row mt-3 justify-content-center">

          <div className="col-md-6">
            <div className="glass-box border-dark m-3">
              <h2 className="nasa-black text-center text-uppercase mt-3">{ accountType === "Developer" ?  "Developer Sign Up" : "Client Sign up"}</h2>
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
                      <label className="fw-bold fs-5">Email:</label>
                      <input
                        className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        onChange={handleInputChange}
                      />
                      <label className="fw-bold fs-5">Password:</label>
                      <input
                        className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        onChange={handleInputChange}
                      />
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
                      // onClick={devSignUp}
                      >
                      Sign Up
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-warning border-dark border-2 mt-3 mb-4 col-6"
                      // onClick={clientSignUp}
                      >
                      Sign Up
                    </button>
                  )}
                  
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <div style={{ height: "120px" }}></div> */}
      </div>
    );
};

export default SignUp;