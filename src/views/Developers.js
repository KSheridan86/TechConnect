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
                    <p className="hand-writing fs-4 text-center">
                            Simply input your particular criteria below and we'll do the rest!
                        </p>
                        <div className="d-flex justify-content-evenly align-items-center mt-3 mb-3">
                            <FontAwesomeIcon icon={faLongArrowAltDown} />
                            <FontAwesomeIcon icon={faLongArrowAltDown} />
                        </div>
                        <div className="row justify-content-center text-center">
                            <div className="col-8">
                                <input
                                    className="text-center border border-dark border-2 p-2 form-control mb-2 hand-writing"
                                    type="text"
                                    placeholder="Who or What are you looking for?"
                                    value={foodType}
                                    onChange={(e) => setFoodType(e.target.value)}
                                />
                            </div>
                            <div className="col-8 text-center hand-writing">
                                <button 
                                    onClick={handleSearch} 
                                    className="btn btn-warning border-dark border-2 mt-3 col-6">
                                        Search
                                </button>
                            </div>
                        </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="glass-box m-3 p-3 text-center">

                        <p>
                        <p className="fs-3 mt-3 mb-2 nasa">Searching made easy!</p>
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