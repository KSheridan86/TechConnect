import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://16.171.133.35:4000/api',
  withCredentials: true,
});

const Logout = ({ onLogout }) => {
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // api.post('/logout');
            onLogout();
            setShouldSlideOut(true);
            setTimeout(() => {
              localStorage.clear();
              navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Logout failed:', error);
        }
        onLogout();
    };

    return (
      <div className='container fill-screen'>
        <div className="row justify-content-center logout">
          <div className={`col-12 col-lg-6 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
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