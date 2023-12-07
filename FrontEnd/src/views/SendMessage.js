import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true,
});

const SendMessage = () => {
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const selectedMessage = JSON.parse(localStorage.getItem('selectedMessage'));
const profile = JSON.parse(localStorage.getItem('profile'));
const navigate = useNavigate();
const [message, setMessage] = useState('');
const [shouldSlideOut, setShouldSlideOut] = useState(false);
const [successMessage, setSuccessMessage] = useState(false);
const [transition, setTransition] = useState(false);
const [errors, setErrors] = useState({});

  const checkUser = () => {
    if ((!selectedMessage && !profile) || !currentUser) {
      navigate('/')
    }
    if (currentUser === null) {
      navigate('/login')
    }
  };

  useEffect(() => {
    checkUser();
  }, []);


  const handleSendMessage = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.data.token}`,
        },
      };
      
      const data = {
        recipient: selectedMessage?.sender || profile?.user,
        message,
        sender: currentUser.data.id,
      };

      const response = await api.post('users/send-message/', data, config);

        console.log(response.data);
        setShouldSlideOut(true);
        setTimeout(() => {
            setSuccessMessage(true);
            setTimeout(() => {
                setTransition(true);
                setTimeout(() => {
                  if (selectedMessage) {
                    navigate('/inbox');
                  } else {
                    navigate('/profile');
                  }
                }, 500);
            }, 2500);
        }, 1000);
        localStorage.removeItem('profile');
        localStorage.removeItem('selectedMessage');
      } catch (error) {
      setErrors({ general: "Whoops, looks like there's a problem sending your message. Please try again later." });
      setTimeout(() => {
        setErrors({});
        setTimeout(() => {
          navigate('/inbox');
        }, 500);
        
        }, 3000);
    }
  };

  return (
    <div className='container'>
    {!successMessage ? (
      <div className="row justify-content-center logout mt-5">
        {errors.general && (
        <div className='notification-overlay fs-3'>
          <div className='alert alert-danger' role='alert'>
            {errors.general}
          </div>
        </div>
        )}
        <div className={`col-12 col-lg-6 mt-5 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
          <div className="glass-box fw-bold p-4 m-5 text-center">
            { selectedMessage ? (
              <div>
              <strong className="header-font">Reply to message from {selectedMessage?.sender_name}</strong>
              <p>{selectedMessage.sender_name} sent: <br />"{selectedMessage.message}"</p>
              </div>
            ) : (
              <strong className="header-font">Message to {profile?.username} from {currentUser?.data.username}</strong>
            )}
            <form className="mt-2 mb-2 hand-writing">
                <div className="mb-3">
                    <textarea
                    className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Type your message here...'
                    />
                </div>
                <button type="button"
                className="btn btn-warning m-auto mt-3" onClick={handleSendMessage}>
                Send Message
                </button>
            </form>
          </div>
        </div>
      </div>) : (
      <div className={`row justify-content-center mt-5 header-font ${ transition ? 'fade-out' : 'fade-in'}`}> 
        <div className="col-5 mt-5 glass-box">
          <h2 className={`header-font mt-2 text-center text-uppercase fade-in p-3 m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
            Message sent!
            <br />
            <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} className='fs-1' />
          </h2>
        </div>
      </div>
    )}
    </div>
  );
};

export default SendMessage;