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

const Inbox = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const unreadMessagesCount = JSON.parse(localStorage.getItem('unreadMessagesCount'));
    const [shouldSlideOut, setShouldSlideOut] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [transition, setTransition] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const { shouldAnimate, setShouldAnimate } = useAnimation();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (shouldAnimate) {
        setShouldSlideOut(true);
        setTimeout(() => {
            setShouldSlideOut(false);
        }, 1000);
        }
    }, [shouldAnimate, setShouldAnimate, navigate]);

    useEffect(() => {
        // Fetch messages from the API
        const fetchMessages = async () => {
            // Configuration for the API request, including authorization header
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser.data.token}`,
                },
            };
            try {
                const response = await api.get(`users/inbox/`, config);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
    
        fetchMessages();
    }, []);

    const handleViewMessage = (message) => {
        console.log(unreadMessagesCount)
        if (unreadMessagesCount > 0) {
            let updatedMessageCount = unreadMessagesCount - 1;
            localStorage.setItem('unreadMessagesCount', updatedMessageCount);
        }
        setSelectedMessage(message);
        console.log(message)
        setFadeOut(true);
        setTimeout(() => {
            setFadeIn(true);
            setShowMessage(true);
        }, 1000);
    };
    const handleBack = () => {
        setFadeIn(false);
        setTimeout(() => {
            setFadeOut(false);
            setShowMessage(false);
            setSelectedMessage({});
        }, 1000);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
    <div className='container fill-screen'>
    {!successMessage ? (
        <div className="row justify-content-center logout mt-5">
            <div className={`col-10 col-lg-6 mt-5 mb-5 glass-box ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
                
                <div className={`${fadeOut ? 'fade-out' : 'fade-in'} ${showMessage ? 'd-none' : ''}`}> 
                    <h1 className="fw-bold p-4 text-center">
                        <strong className="header-font">Inbox</strong>
                    </h1>
                    <div className="mb-3 text-center">
                        <span className="btn btn-warning btn-sm">
                            Unread
                        </span>
                        <span className="btn btn-success btn-sm">
                            Read
                        </span>
                    </div>
                    <ul className="p-0">
                        {messages.map((message) => (
                            <li key={message.id}>
                                <button 
                                    className={`header-font btn btn-lg mt-2 w-75 d-flex 
                                        justify-content-between align-items-center m-auto 
                                        ${!message.is_read ? 'btn-warning' : 'btn-success'}`} 
                                        onClick={() => handleViewMessage(message)}>
                                    <div>
                                        From: <br />
                                        <strong>
                                            {capitalizeFirstLetter(message.sender_name)}
                                        </strong>
                                    </div>
                                    {message.message.length > 15 ? `
                                        ${message.message.slice(0, 15)}...` : 
                                        message.message
                                    }
                                    <br />
                                    {message.formatted_date}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                { showMessage ? (
                    <div className={`message-box mt-3 ${fadeIn ? 'fade-in' : 'fade-out'}`}>
                
                    <button
                        className="btn btn-secondary mb-3"
                        onClick={() => handleBack()}
                    >
                        Back
                    </button>
                    <h1 className="fw-bold text-center">
                        {/* <strong className="header-font">{capitalizeFirstLetter(selectedMessage.sender_name)}</strong> */}
                    </h1>
                    <div className="mt-3">
                        <strong>Message:</strong>
                        <p>{selectedMessage.message}</p>
                    </div>
                    <div className="mt-3">
                        <strong>Date:</strong>
                        <p>{selectedMessage.formatted_date}</p>
                    </div>
    
                </div>
                ) : (null)}
                
            </div>
        </div>) : (
        <div className={`row justify-content-center mt-5 header-font ${ transition ? 'fade-out' : 'fade-in'}`}> 
            <div className="col-5 mt-5 glass-box">
                <h2 className={`header-font mt-2 text-center text-uppercase fade-in p-3 m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
                    Logout Successful!
                    <br />
                    <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} className='fs-1' />
                </h2>
            </div>
        </div>)}
    </div>
    );
};

export default Inbox;