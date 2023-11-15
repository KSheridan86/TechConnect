import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true,
});

const AddSkills = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const returnUrl = location.state ? location.state.returnUrl : null;

    console.log('returnUrl from state:', returnUrl);
    const [primarySkills, setPrimarySkills] = useState('');
    const [secondarySkills, setSecondarySkills] = useState('');
    const [currentSkills1, setCurrentSkills1] = useState([]);
    const [currentSkills2, setCurrentSkills2] = useState([]);

    useEffect(() => {
        // Fetch current skills when the component mounts
        const fetchSkills = async () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${currentUser.data.token}`,
                    },
                };
                
                const response = await api.get('users/profile/', config);
                setCurrentSkills1(response.data.skills_level_1);
                console.log('Current skills level 1:', response.data.skills_level_1);
                setCurrentSkills2(response.data.skills_level_2);
                console.log('Current skills level 2:', response.data.skills_level_2);
            } catch (error) {
                console.error('Error fetching current skills:', error);
            }
        };

        fetchSkills();
    }, []);

    const addSkills = async () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const formData = new FormData();

        // Create a function to join skills with commas
        const joinSkills = (skills) => (skills.length > 0 ? skills.join(', ') : '');

        const newSkills1 = [...currentSkills1, primarySkills];
        const newSkills2 = [...currentSkills2, secondarySkills];

        // Append skills to form data
        formData.append('skills_level_1', joinSkills(newSkills1));
        formData.append('skills_level_2', joinSkills(newSkills2));

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${currentUser.data.token}`,
                },
            };

            const response = await api.post('users/update_profile/', formData, config);

            console.log('Profile updated with skills:', response.data);
            if (returnUrl) {
            navigate('/profile');
            } else {
            navigate('/add-projects');
            }
        } catch (error) {
            console.error('Error updating profile with skills:', error);
            console.log('Error response from server:', error.response);
        }
    };

    return (
        <div className='container mt-4 fill-screen'>
            <div className='row justify-content-center login'>
                <div className='col-12'>
                    <h2 className='nasa-black text-center text-uppercase mt-3'>
                    Add Skills to your Profile
                    </h2>

                    <form>
                        <div className='row justify-content-evenly text-center'>
                            <div className='col-md-10 mb-3'>
                            <div className='glass-box border-dark m-3 p-3'>
                                <h3 className="nasa text-uppercase">Skills</h3>
                                <div className='mb-3'>
                                <h4 className="fw-bold">Use this space to inform clients of your abilities, ie "React", "Python" etc...</h4>
                                <br />
                                <label className='fw-bold'>Lets start with your primary skills, the ones you're most proficient and comfortable with.</label>
                                <textarea
                                    className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                    name='skills_level_1'
                                    placeholder='Add your PRIMARY skills here separated by commas'
                                    onChange={(e) => setPrimarySkills(e.target.value)}
                                />
                                <br />
                                <label className='fw-bold'>Now add your secondary skills, skills you're familiar with but not a pro in.</label>
                                <textarea
                                    className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                    name='skills_level_2'
                                    placeholder='Add your SECONDARY skills here separated by commas'
                                    onChange={(e) => setSecondarySkills(e.target.value)}
                                />
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className='text-center hand-writing'>
                            <button
                                type='button'
                                className='btn btn-warning btn-lg'
                                onClick={addSkills}>
                                Add Skills
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSkills;