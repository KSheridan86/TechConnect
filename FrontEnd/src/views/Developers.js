import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAnimation } from '../components/AnimationContext';

const Developers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [shouldSlideOut, setShouldSlideOut] = useState(false);
    const [searchButtonClicked, setSearchButtonClicked] = useState(false); 
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

    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api/',
        withCredentials: true,
    });

    useEffect(() => {
        async function fetchUsers(){
            const { data } = await api.get('users/');
            setUsers(data);
        }
        fetchUsers();

    // empty array left here to prevent the api call from being made repeatedly
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 
    const handleSearch = () => {
        // Filter users based on the search term
        const filteredUsers = users.filter((user) =>
            Object.values(user).some(
                (value) =>
                    typeof value === 'string' &&
                    value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        // Update the state with the filtered users
        setFilteredUsers(filteredUsers);
        setSearchButtonClicked(true);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setSearchButtonClicked(false); // Reset search button click when user starts typing
    };

    const handleUserClick = (userId) => {
        // Use navigate to go to the profile page and pass user.id as state
        setShouldSlideOut(true);
        setTimeout(() => {
          navigate(`/profile`, { state: { userId } });
      }, 1000);
    };

    return (
        <div className="container mt-4 fill-screen">
          <div className="row justify-content-center">
      
            <div className={`col-10 col-md-5 glass-box p-2 mt-3 text-center max ${shouldSlideOut ? 'animate-slide-out-left' : 'animate-slide-left'}`}>
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
              <p className="hand-writing fs-4 text-center mb-3">
                Simply input your particular criteria below and we'll do the rest!
              </p>
              <div className="row justify-content-center text-center">
                <div className="col-8">
                  <input
                    className="text-center border border-dark border-2 p-2 form-control mb-3 hand-writing"
                    type="text"
                    placeholder="Who or What are you looking for?"
                    value={searchTerm}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-8 text-center hand-writing">
                  <button
                    className="btn btn-warning border-dark border-2 mt-3 col-6"
                    onClick={handleSearch}>
                    Search
                  </button>
                </div>
              </div>
            </div>
      
            <div className={`col-12 col-md-6 max mb-5 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-right'}`}>
              <div className="glass-box m-3 text-center">
      
                <div className="p-3">
                  <p className="fs-3 mb-2 nasa text-uppercase">Searching made easy!</p>
                  <div className="fs-5 mt-2 mb-1 nasa">Name</div>
                  <p>
                    Have a specific developer in mind?
                    Search their name to quickly find their profile and portfolio.
                  </p>
                  <hr />
                  <div className="fs-5 mt-3 mb-1 nasa">Tech Stack</div>
                  <p>
                    Use our technology stack filter to discover developers who specialize in
                    what you need.
                  </p>
                  <hr />
                  <div className="fs-5 mt-3 mb-1 nasa">Experience</div>
                  <p>
                    Find developers with the right level of experience for your project,
                    whether you're looking for seasoned veterans or fresh talent.
                  </p>
                  <hr />
                  <div className="fs-5 mt-3 mb-1 nasa">Location</div>
                  <p>
                    Prefer to work with developers in your area or time zone?
                    Our location filter helps you narrow down your search.
                  </p>
                </div>
              </div>
            </div>
          </div>
      
             {/* New container for the filtered user list */}
    <div className="row justify-content-center mt-3">
      <div className="col-10 text-center max animate-slide-left">
        <div className="row">
          {searchButtonClicked && searchTerm && filteredUsers.length === 0 ? (
            <p className="col">Sorry, that search returned no results!</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`col-12 col-md-4 mb-3 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}
                onClick={() => handleUserClick(user.id)}
              >
                <div className="result-box glass-box p-2">
                  <p>
                    {user.username}<br />
                    {user.email}<br />
                    {user.account_type}<br />
                    {user.id}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
      
          <div style={{ height: "100px" }}></div>
        </div>
      );
};

export default Developers;