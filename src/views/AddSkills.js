import React, { useState } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const api = axios.create({
//     baseURL: 'http://16.171.133.35:4000', // Replace with the actual base URL of your Rails API
//     withCredentials: true,
// });

const AddSkills = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);

    const handleInputChange = event => {
        const { value } = event.target;
        // Split the input value into an array of skills using commas as separators
        const skillsArray = value.split(',').map(skill => skill.trim());
        setSkills(skillsArray);
    };

    const addSkills = () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('Users'));
        // Find the current user in the Users array
        const updatedUsers = users.map((user) => {
            if (user.username === currentUser.username) {
                user.skills = skills;
            }
            return user;
        });
        localStorage.setItem('Users', JSON.stringify(updatedUsers));
        navigate("/add-projects");
    };
    

    return (
        <div className='container mt-4'>
            <div className='row justify-content-center login'>
                <div className='col-12'>
                    <h2 className='nasa-black text-center text-uppercase mt-3'>
                    Add Skills to your Profile
                    </h2>

                    <form>
                    <div className='row justify-content-evenly text-center'>
                        <div className='col-md-5 mb-3'>
                        <div className='glass-box border-dark m-3 p-3'>
                            <h4 className="nasa text-uppercase">Skills</h4>
                            <div className='mb-3'>
                            
                            <label className='fw-bold'>Use this space to inform clients of your abilities, ie "React", "Python" etc...</label>
                            <textarea
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                name='intro'
                                placeholder='Add your skills here separated by commas'
                                onChange={handleInputChange}
                            />
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className='text-center hand-writing'>
                                <button
                                    type='submit'
                                    className='btn btn-warning btn-lg'
                                    onClick={addSkills}>
                                    Add Skills
                                </button>
                    </div>
                    
                    </form>
            </div>
            <div style={{ height: '16rem' }}></div>
        </div>
        </div>
    );
};

export default AddSkills;