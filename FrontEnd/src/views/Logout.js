import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAnimation } from '../components/AnimationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

const Logout = ({ onLogout }) => {
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [transition, setTransition] = useState(false);
  const { shouldAnimate, setShouldAnimate } = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldAnimate) {
      setShouldSlideOut(true);
      setTimeout(() => {
        setShouldSlideOut(false);
    }, 1000);
    }
  }, [shouldAnimate, setShouldAnimate, navigate]);

  const handleLogout = async () => {
    try {
      const response = await api.post('users/logout/');
      console.log(response.data);  // Handle the success message
      setShouldSlideOut(true);
      const displayMessage = () => {
            setTimeout(() => {
              setTransition(true)
              onLogout();
              setTimeout(() => {
                navigate('/');
              }, 1000);
            }, 1750);
      };
      setTimeout(() => {
        setSuccessMessage(true)
          displayMessage();
      }, 1000);
    } catch (error) {
      console.error('Logout failed:', error.response.data);
    }
  };

  return (
    <div className='container fill-screen'>
    {!successMessage ? (
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
      </div>) : (
      <div className={`row justify-content-center mt-5 nasa-black ${ transition ? 'fade-out' : 'fade-in'}`}> 
        <div className="col-5 mt-5 glass-box">
          <h2 className={`nasa mt-2 text-center text-uppercase fade-in p-3 m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
            Logout Successful!
            <br />
            <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} className='fs-1' />
          </h2>
        </div>
      </div>)}
    </div>
  );
};

export default Logout;