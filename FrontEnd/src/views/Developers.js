import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Developers = () => {
    const [users, setUsers] = useState([]);
    const apiUrl = 'http://127.0.0.1:8000/api/';

    useEffect(() => {
        async function fetchUsers(){
            const { data } = await axios.get(apiUrl + 'users/');
            setUsers(data);
            console.log(data);
        }
        fetchUsers();
        
    }, []);

    return (
        <div className="container mt-3">
            <div className="row justify-content-center">

                <div className="col-10 col-md-6 glass-box p-3 mt-3 text-center">
                    <h1 className="fw-bold p-2 text-center nasa text-uppercase">Discover Talented Developers!</h1>
                    <p className="p-2">
                        Looking for the right developer for your project? 
                        <br />
                        You're in the right place! 
                        <br />
                        Explore a diverse pool of talented 
                        individuals with expertise in various technologies and experience levels.
                    </p>
                    <hr />
                    <p className="hand-writing fs-4 text-center mb-4">
                            Simply input your particular criteria below and we'll do the rest!
                        </p>
                        <div className="d-flex justify-content-evenly align-items-center mt-3 mb-4">
                            <FontAwesomeIcon icon={faLongArrowAltDown} />
                            <FontAwesomeIcon icon={faLongArrowAltDown} />
                        </div>
                        <div className="row justify-content-center text-center">
                            <div className="col-8">
                                <input
                                    className="text-center border border-dark border-2 p-2 form-control mb-3 hand-writing"
                                    type="text"
                                    placeholder="Who or What are you looking for?"
                                />
                            </div>
                            <div className="col-8 text-center hand-writing mb-3">
                                <button  
                                    className="btn btn-warning border-dark border-2 mt-3 col-6">
                                        Search
                                </button>
                            </div>
                        </div>
                        <hr />
                        <div>
                            {users.length > 0 ? (
                                users.map((user) => {
                                    return <p key={user.id}>
                                        {user.username}<br />
                                        {user.email}<br />
                                        {user.profile_type}
                                        </p>;
                                })
                            ) : (
                                <p>no users</p>
                            )}
                        </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="glass-box m-3 p-3 text-center">

                        <p>
                        <p className="fs-3 mt-3 mb-2 nasa text-uppercase">Searching made easy!</p>
                        <p className="fs-5 mt-3 mb-2 nasa">Name</p>
                        Have a specific developer in mind? 
                        You can search by their name to quickly find their profile and portfolio.
                        <hr />
                        <p className="fs-5 mt-3 mb-2 nasa">Tech Stack</p>
                        Need someone skilled in a particular technology or programming language? 
                        Use our technology stack filter to discover developers who specialize in 
                        what you need.
                        <hr />
                        <p className="fs-5 mt-3 mb-2 nasa">Experience</p>
                        Find developers with the right level of experience for your project, 
                        whether you're looking for seasoned veterans or fresh talent.
                        <hr />
                        <p className="fs-5 mt-3 mb-2 nasa">Location</p>
                        Prefer to work with developers in your area or time zone? 
                        Our location filter helps you narrow down your search.
                        </p>
                    </div>
                </div>
            </div>
            <div style={{height: "100px"}}></div>
        </div>
    );
};

export default Developers;