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
    const [showConfirm, setShowConfirm] = useState(false);
    const { shouldAnimate, setShouldAnimate } = useAnimation();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState({});
    const [errors, setErrors] = useState({});
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
                setErrors({ general: 
                    "Whoops, looks like there's an issue fetching your messages. Please try again." });
                setTimeout(() => {
                    setErrors({});
                    setShouldSlideOut(true);
                    setTimeout(() => {
                        navigate('/');
                    }, 1000);
                }, 3000);
            }
        };
    
        fetchMessages();
    }, []);

    const confirmDelete = () => {
        setFadeOut(false);
        setTimeout(() => {
            setShowConfirm(true);
        }, 1000);
    }

    const cancelDelete = () => {
        setFadeOut(true);
        setTimeout(() => {
            setShowConfirm(false);
        }, 1000);
    }


    const handleDeleteMessage = async (messageId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.data.token}`,
            },
        };
        try {
            // Make API request to delete the message
            const response = await api.delete(`users/delete-message/${messageId}/`, config);
            
            // Check if the delete operation was successful
            if (response.status === 204) {
                // Remove the deleted message from the state
                setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));

                setFadeIn(false);
                setTimeout(() => {
                    setShowMessage(false);
                    setFadeOut(false);
                    setShowConfirm(false);
                    setSelectedMessage({});
                }, 1000);
            } else {
                console.error('Error deleting message:', response.data);
                // Handle error if the delete operation was not successful
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            setErrors({ general: "Whoops, looks like there's an issue deleting this message. Please try again." });
            // Handle error if the API request fails
            setTimeout(() => {
                setErrors({});
                // setShouldSlideOut(true);
                setTimeout(() => {
                    // navigate('/inbox');
                    setShowMessage(false);
                }, 1000);
            }, 3000);
        }
    };

    const handleViewMessage = (message) => {
        // console.log(unreadMessagesCount)
        // if (unreadMessagesCount > 0) {
        //     let updatedMessageCount = unreadMessagesCount - 1;
        //     localStorage.setItem('unreadMessagesCount', updatedMessageCount);
        // }
        setSelectedMessage(message);
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

    // function capitalizeFirstLetter(string) {
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    // }

    return (
    <div className='container fill-screen'>
    {!successMessage ? (
        <div className="row justify-content-center logout mt-5">
            <div className={`col-10 col-lg-6 mt-5 mb-5 glass-box ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
                {errors.general && (
                <div className='notification-overlay fs-3'>
                <div className='alert alert-danger' role='alert'>
                    {errors.general}
                </div>
                </div>
                )}
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
                                            {message.sender_name}
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
                    <div className="fw-bold text-center">
                        Message from: <br />
                        <strong className="header-font fs-3">{selectedMessage.sender_name}</strong>
                    </div>
                    <div className="mt-3 text-center">
                        <strong>Message:</strong>
                        <p className="hand-writing fs-4">{selectedMessage.message}</p>
                    </div>
                    <div className="mt-3 text-center">
                        <strong>Date:</strong>
                        <p>{selectedMessage.formatted_date}</p>
                    </div>

                    { showConfirm ? (
                    <div className={`mt-3 text-center ${!fadeOut ? 'fade-in' : 'fade-out'}`}>
                        <button className="btn btn-danger m-2 mt-3 mb-3" 
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        >
                        Confirm?
                        </button>
                        <button className="btn btn-secondary m-2 mt-3 mb-3"
                        onClick={() => cancelDelete()}>
                            Cancel
                        </button>
                        <p className="text-danger fw-bold">This will permanently delete this message!</p>
                    </div>
                    ) : (
                    <div className={`mt-3 text-center ${!fadeOut ? 'fade-out' : 'fade-in'}`}>
                        <button className="btn btn-danger m-2 mt-3 mb-3" 
                        onClick={() => confirmDelete()}
                        >
                        Delete
                        </button>
                        <button className="btn btn-secondary m-2 mt-3 mb-3">
                            Reply
                        </button>
                    </div>
                    )}
                    
                    
    
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