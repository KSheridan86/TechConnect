import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';

const Developers = () => {
    const [foodType, setFoodType] = useState('');
    const [nutritionInfo, setNutritionInfo] = useState(null);
    const apiKey = 'ea0f0eff98a1a9e86e859c075afe7746';

    const handleSearch = async () => {
        try {
        const response = await fetch(
            `https://trackapi.nutritionix.com/v2/natural/nutrients`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-app-id': '88f90da2',
                'x-app-key': apiKey,
            },
            body: JSON.stringify({ query: foodType }),
            }
        );

        if (response.ok) {
            const data = await response.json();
            setNutritionInfo(data.foods[0]);
        } else {
            console.error('Error fetching data');
        }
        } catch (error) {
        console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                <div className="">
                    <h1 className="glass-box m-3 fw-bold p-4 text-center nasa-black text-uppercase">Discover Talented Developers!</h1>
                    <div className="glass-box m-3 p-3 text-center">
                        <p>
                        Looking for the right developer for your project? 
                        <br />
                        You're in the right place! 
                        <br />
                        Explore a diverse pool of talented 
                        individuals with expertise in various technologies and experience levels.
                        </p>
                        <hr />
                        <p>
                        <p className="fs-5 mt-3 mb-2">Searching made easy!</p>
                        <p className="fs-5 mt-3 mb-2">Name</p>
                        Have a specific developer in mind? 
                        You can search by their name to quickly find their profile and portfolio.
                        <hr />
                        <p className="fs-5 mt-3 mb-2">Tech Stack</p>
                        Need someone skilled in a particular technology or programming language? 
                        Use our technology stack filter to discover developers who specialize in 
                        what you need.
                        <hr />
                        <p className="fs-5 mt-3 mb-2">Experience</p>
                        Find developers with the right level of experience for your project, 
                        whether you're looking for seasoned veterans or fresh talent.
                        <hr />
                        <p className="fs-5 mt-3 mb-2">Location</p>
                        Prefer to work with developers in your area or time zone? 
                        Our location filter helps you narrow down your search.
                        </p>
                        <hr />
                        <p className="hand-writing fs-4">
                            Simply input your particular criteria below and we'll do the rest!
                        </p>
                        <div className="d-flex justify-content-evenly align-items-center mt-3">
                            <FontAwesomeIcon icon={faLongArrowAltDown} />
                            <FontAwesomeIcon icon={faLongArrowAltDown} />
                        </div>
                    </div>
                    <div className="glass-box m-3 p-3 d-flex justify-content-center align-items-center">
                        <div className="row">
                            <div className="col-12">
                                <input
                                    className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                                    type="text"
                                    placeholder="Who or What are you looking for?"
                                    value={foodType}
                                    onChange={(e) => setFoodType(e.target.value)}
                                />
                            </div>
                            <div className="col-12 text-center hand-writing">
                                <button 
                                    onClick={handleSearch} 
                                    className="btn btn-warning border-dark border-2 mt-3 col-6">
                                        Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div style={{height: "100px"}}></div>
        </div>
    );
};

export default Developers;