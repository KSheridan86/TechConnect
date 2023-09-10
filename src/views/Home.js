import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://16.171.133.35:4000',
    withCredentials: true,
});

const Home = ({loggedIn}) => {
    const [UserData, setUserData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dataFromLogin = location.state?.data;
    
    useEffect(() => {
        // Check if UserData & profileData exists in local storage
        const storedProfileData = JSON.parse(localStorage.getItem('profileData'));
        const storedUserData = JSON.parse(localStorage.getItem('UserData'));
        if (storedProfileData) {
            setProfileData(storedProfileData);
        }
        if (storedUserData) {
            setUserData(storedUserData);
        }

        if (dataFromLogin !== undefined || loggedIn) {
            fetchProfileData(dataFromLogin);
        } else if (location.state?.userId) {
            fetchProfileData(location.state.userId);
        }
    
    }, [dataFromLogin, loggedIn, location.state?.userId]);

    const fetchProfileData = async (userId) => {
        try {
            const response = await api.get(`/api/users/${userId}`);
            setUserData(response.data);
            // Store the profileData in local storage
            localStorage.setItem('UserData', JSON.stringify(response.data));

            setProfileData(response.data.profile);
            // Store the profileData in local storage
            localStorage.setItem('profileData', JSON.stringify(response.data.profile));

        } catch (error) {
            // console.error('Failed to fetch profile data:', error);
        }
    };

    const handleSignUp = () => {
        navigate("/signup");
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="glass-box border-dark m-3 nasa">
                        <h1 className="p-4 pb-1 text-center">
                        Welcome to <br />
                        <span className="text-uppercase">TechConnect</span>
                        </h1>
                    </div>

                    <div className="p-3 text-center glass-box m-3 border-dark">
                        <p>
                        The premier platform for connecting with talented
                        developers and finding the right expertise for your projects. 
                        Whether you're a developer looking to showcase your skills or a
                        client seeking top-notch tech talent, TechConnect is the place to be.
                        </p>
                        <hr />
                        <h1 className='nasa'>Developers!</h1>
                        <p>
                        Create free accounts and build professional portfolio
                        pages. Showcase your work, highlight your skills, and let potential clients discover
                        your talent.
                        </p>
                        <hr />
                        <p>
                        Include your contact information on your portfolio page, making it easy for 
                        clients to reach out to you directly.
                        </p>
                        <hr />
                        <p>
                        Receive private messages from clients interested in your services.
                        Communicate securely within the TechConnect platform.
                        </p>
                        <hr />
                        <h1 className='nasa text-uppercase'>Clients!</h1>
                        <p>
                        Create an account to explore developer profiles, unlock contact details,
                        and send private messages to your perfect developer.
                        </p>
                        <hr />

                        <div>
                            <p className="pb-3">
                            Ready to get started? Join TechConnect today and take your career and projects to the next level!
                            </p>
                            <div className="col-12 text-center hand-writing mb-3 m-2">
                                <button onClick={handleSignUp} className="btn btn-warning border-dark custom-button">
                                    Sign Up as a Developer
                                </button>
                            </div>
                            <div className="col-12 text-center hand-writing mb-3 m-2">
                                <button onClick={handleSignUp} className="btn btn-warning border-dark custom-button">
                                    Sign Up as a Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ height: "80px" }}></div>
        </div>
    );
};

export default Home;