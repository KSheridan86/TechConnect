import React, { useState } from 'react';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const { recipient } = location?.state;
  console.log(recipient)

  const [shouldSlideOut, setShouldSlideOut] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [transition, setTransition] = useState(false);


  const handleSendMessage = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.data.token}`,
        },
      };

      const data = {
        recipient,
        message,
        sender: currentUser.data.id,
      };
      console.log(data)

      const response = await api.post('users/send-message/', data, config);

      if (response.status === 201) {
        // Optionally, you can navigate to another page or show a success message
        console.log('Message sent successfully');
        setShouldSlideOut(true);
        setTimeout(() => {
            setSuccessMessage(true);
            setTimeout(() => {
                setTransition(true);
                setTimeout(() => {
                    navigate('/inbox');
                }, 500);
            }, 2500);
        }, 1000);
      } else {
        console.error('Error sending message:', response.data);
        // Handle error if the send operation was not successful
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error if the API request fails
    }
  };

  return (
    <div className='container fill-screen'>
    {!successMessage ? (
      <div className="row justify-content-center logout mt-5">
        <div className={`col-12 col-lg-6 mt-5 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
          <div className="glass-box fw-bold p-4 m-5 text-center">
            <strong className="header-font">Enter your message below...</strong>
            <form className="mt-2 mb-2 hand-writing">
                <div className="mb-3">
                    <textarea
                    className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
    // <div>
    //   <h2>Send Message</h2>
  
    // </div>
  );
};

export default SendMessage;