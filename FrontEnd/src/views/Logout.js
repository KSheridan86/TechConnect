import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

const Logout = ({ onLogout }) => {
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const refreshToken = currentUser.data.refresh
  console.log(refreshToken);
  const navigate = useNavigate();

    const handleLogout = async () => {
      
        try {
          const response = await api.post('users/logout/');
          console.log(response.data);  // Handle the success message
            setShouldSlideOut(true);
            setTimeout(() => {
              onLogout();
              navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Logout failed:', error.response.data);
        }
    };

    return (
      <div className='container fill-screen'>
        <div className="row justify-content-center logout mt-5">
          <div className={`col-12 col-lg-6 mt-5 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
            <h1 className="glass-box fw-bold p-4 m-5 text-center">
              <strong className="nasa">Are you sure you want to Logout?</strong>
            </h1>
            <div className="col-12 text-center hand-writing">
              <button 
                onClick={handleLogout}
                className="btn btn-warning border-dark border-2 col-6">
                  Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Logout;