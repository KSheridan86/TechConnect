import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://16.171.133.35:4000/api',
  withCredentials: true,
});

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const navigate = useNavigate();
    
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', {
        user: {
          email,
          password,
        },
      });
      setData(response.data.user.id)
      localStorage.setItem('userId', JSON.stringify(response.data.user.id));
      
    } catch (error) {
        console.error('Error while making the API call:', error);
      }
  };

  useEffect(() => {
    if (data !== null) {
      onLogin()
      navigate('/', { state: {data}})
    }
  }, [data, navigate, onLogin]);

  return (
    <div className="container login">
      <div style={{ height: "70px" }} className="d-none d-lg-block"></div>
        <div className="row">

          <div className="col-md-6">
            <form className="glass-box m-3 mb-3" onSubmit={handleLogin}>
              <div className="d-flex justify-content-center align-items-center mt-4">
                <div className="row p-3">
                  <div className="col-12">
                    <input
                      className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      type="submit">
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-md-6 hand-writing">
            <div className="glass-box m-3 fw-bold p-4 text-center">
              <p>Don't have an account yet?</p>
              <p>Sign up here!</p>
              <button className="btn btn-warning border-dark border-2 mt-3 col-6 mb-4" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
            
          </div>
        </div>
      <div style={{ height: "75px" }}></div>
    </div>
  );
};

export default Login;