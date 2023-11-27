import React, {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnimation } from '../components/AnimationContext';
import logo from "../images/logo.png";

const Home = () => {
    const navigate = useNavigate();
    const [shouldSlideOut, setShouldSlideOut] = useState(false);
    const { shouldAnimate, setShouldAnimate } = useAnimation();

    useEffect(() => {
        if (shouldAnimate) {
            setShouldSlideOut(true);
            setTimeout(() => {
                setShouldSlideOut(false);
            }, 1000);
        }
    }, [shouldAnimate, setShouldAnimate, navigate]);

    const handleSignUp = (accountType) => {
        setShouldSlideOut(true);
        setTimeout(() => {
            navigate("/signup", { state: { accountType } });
        }, 1000);
    }

    return (
        <div className="container mt-4 fill-screen">
            <div className="row justify-content-center mt-5">
                <div className={`col-md-6 ${shouldSlideOut ? 'animate-slide-out-left' : 'animate-slide-left'}`}>
                    <div className="glass-box border-dark m-3 nasa p-4 text-center">
                        <div className="circle-image m-auto mb-3">
                            <img src={logo} alt="Circle" />
                        </div>
                        <p>
                        The premier platform for connecting with talented
                        developers and finding the right expertise for your projects. 
                        Whether you're a developer looking to showcase your skills or a
                        client seeking top-notch tech talent, TechConnect is the place to be.
                        </p>
                        <hr />
                        <div className="hand-writing">
                            <p>
                            Ready to get started? Join TechConnect today and take your career or your projects to the next level!
                            </p>
                            <button onClick={() => handleSignUp('Developer')} className="hand-writing btn btn-warning border-dark m-1 custom-button">
                                Sign Up as a Developer
                            </button>
                            <button onClick={() => handleSignUp('Client')} className="btn btn-warning border-dark custom-button m-1">
                                Sign Up as a Client
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`col-md-6 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-right'}`}>
                    <div className="p-3 text-center glass-box m-3 border-dark">
                        <h1 className='nasa mb-3'>Developers!</h1>
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
                    </div>
                </div>
            </div>
            <div style={{ height: "20vh" }}></div>
        </div>
    );
};

export default Home;