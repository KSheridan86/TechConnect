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
    const [shouldSlideOut, setShouldSlideOut] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [transition, setTransition] = useState(false);
    const { shouldAnimate, setShouldAnimate } = useAnimation();
    const [messages, setMessages] = useState([]);
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
                    'Content-Type': 'multipart/form-data', // This line is needed for file uploads
                    Authorization: `Bearer ${currentUser.data.token}`,
                },
            };
            try {
                const response = await api.get(`users/inbox/`, config);
                setMessages(response.data); // assuming the API response is an array of messages
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
    
        fetchMessages();
    }, []);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
    <div className='container fill-screen'>
    {!successMessage ? (
        <div className="row justify-content-center logout mt-5">
            <div className={`col-10 col-lg-6 mt-5 mb-5 glass-box ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
            <h1 className="fw-bold p-4 text-center">
                <strong className="header-font">Inbox</strong>
            </h1>
            <ul className="p-0">
                {messages.map((message) => (
                    <li key={message.id}>
                        <button 
                            className='header-font 
                                       btn btn-success btn-lg mt-2 
                                       w-75 d-flex justify-content-between 
                                       align-items-center m-auto' >
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