import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create an Axios instance with a base URL and credentials
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true,
});

const Footer = ({onLogout}) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const [confirmation, setConfirmation] = useState(false);
    const [fadeButton, setFadeButton] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [transition, setTransition] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const confirmDelete = () => {
        setFadeButton(true);
        setTimeout(() => {
            setConfirmation(true);
        }, 1000);
    }

    const cancelDelete = () => {
        setFadeButton(false);
        setTimeout(() => {
            setConfirmation(false);
        }, 1000);
    }

    const deleteAccount = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser.data.token}`,
                },
            };
        
            const response = await api.delete(`users/delete-account/${currentUser.data.id}/`, config);
            // Handle the response, e.g., show a success message, navigate to a different page, etc.
            console.log(response);
            onLogout()

            
            const displayMessage = () => {
                setTimeout(() => {
                    setSuccessMessage(true)
                    setTransition(true);
                    setTimeout(() => {
                        setSuccessMessage(false);
                        navigate('/');
                    }, 2000);
                }, 1000);
            }
            displayMessage();
    
            } catch (error) {
                console.error('Error deleting user account:', error);
                setErrors({ 
                    general: 
                    "Whoops, Somebody wants you to stick around!." });
                setTimeout(() => {
                    setErrors({});
                }, 3000);
        }
    }

    return (
    <footer className="footer text-white text-center py-3 fixed-bottom">
        {!successMessage ? (
        <div className="container">
        {errors.general && (
            <div className='notification-overlay fs-3'>
                <div className='alert alert-danger' role='alert'>
                    {errors.general}
                </div>
            </div>
        )}
            <div className="row">
                <div className={`${ currentUser !== null ? 'col-md-6' : 'col-12'}`}>
                    <div className="small common-font">
                        Designed & Built by ChimpTech Web Design    
                        <div>
                            © 2023 - All rights reserved
                        </div>
                    </div>
                </div>
                {currentUser !== null ? (
                <div className="col-md-6 col-12 mt-3 mt-md-0">
                {confirmation ? (
                    <div className={`${fadeButton ? 'fade-in' : 'fade-out'}`}>
                        <button 
                            className={`btn btn-warning btn-block mx-2`}
                            onClick={cancelDelete}>
                                Cancel
                            </button>
                        <button 
                            className={`btn btn-danger btn-block mx-2`}
                            onClick={deleteAccount}>
                                Confirm?
                        </button>
                    </div>
                ) : (
                    <div className={`${fadeButton ? 'fade-out' : 'fade-in'}`}>
                        <button 
                        className={`btn btn-danger btn-block`}
                        onClick={confirmDelete}>
                            Delete Account
                        </button>
                    </div>
                )}
                </div>
                ) : (null)}
            </div>
        </div>
        ) : (
            <div className="container">
            <div className="small common-font">
                Profile Deleted Successfully!
            </div>
        </div>
        )} 
    </footer>
    );
};

export default Footer;