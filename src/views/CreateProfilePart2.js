import React, { useState } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const api = axios.create({
//     baseURL: 'http://16.171.133.35:4000', // Replace with the actual base URL of your Rails API
//     withCredentials: true,
// });

const CreateProfilePart2 = () => {
    const navigate = useNavigate();
    const [project, setProject] = useState({
        name: '',
        description: '',
        techStack: '',
        siteUrl: '',
        repoUrl: '',
        image: '',
    });

    const handleInputChange = event => {
        const { name, value } = event.target;
        setProject(prevProject => ({ ...prevProject, [name]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
            setProject((prevProject) => ({
                ...prevProject,
                image: e.target.result,
            }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();
        // try {
        //     localStorage.setItem('profileData', JSON.stringify(project));
        //     const response = await api.post('/api/profiles', { project });
        //     if (response) {
        //         navigate('/');
        //     }
        //     console.log('Profile created successfully', response.data);
        // } catch (error) {
        //     console.error('Failed to create profile:', error);
        // }
    };

    const addProject = () => {
        localStorage.setItem('newProject', JSON.stringify(project));
        navigate("/profile");
    };
    

    return (
        <div className='container'>
            <div className='row justify-content-center login'>
                <div className='col-12'>
                    <h2 className='nasa-black text-center text-uppercase mt-3'>
                    Add content to your Profile
                    </h2>

                    <form onSubmit={handleSubmit}>
                    <div className='row justify-content-evenly text-center'>
                        <div className='col-md-5 mb-3'>
                        <div className='glass-box border-dark m-3 p-3'>
                            <h4 className="nasa text-uppercase">Skills</h4>
                            <div className='mb-3'>
                            
                            <label className='fw-bold fs-5'>Skills:</label>
                            <textarea
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                name='intro'
                                placeholder='Add your skills here separated by commas'
                                onChange={handleInputChange}
                            />
                            </div>
                        </div>
                        </div>

                        <div className='col-md-5 mb-3'>
                        <div className='glass-box border-dark m-3 p-3'>
                            <h4 className="nasa text-uppercase">Add Projects</h4>
                            <div className='mb-3'>
                            <label className='fw-bold fs-5'>Name:</label>
                            <input
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                type='text'
                                name='name'
                                placeholder='Enter Name of Project'
                                onChange={handleInputChange}
                            />
                            <label className='fw-bold fs-5'>Description:</label>
                            <input
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                type='text'
                                name='description'
                                placeholder='Enter Description of project'
                                onChange={handleInputChange}
                            />
                            <label className='fw-bold fs-5'>Tech Stack:</label>
                            <input
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                type='text'
                                name='techStack'
                                placeholder='Enter the Tech Stack used on Project'
                                onChange={handleInputChange}
                            />
                            <label className='fw-bold fs-5'>Site URL:</label>
                            <input
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                type='text'
                                name='SiteUrl'
                                placeholder='Enter Site URL'
                                onChange={handleInputChange}
                            />
                            <label className='fw-bold fs-5'>Repo URL:</label>
                            <input
                                className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                type='text'
                                name='RepoUrl'
                                placeholder='Enter Repo URL'
                                onChange={handleInputChange}
                            />
                            <label className='fw-bold fs-5'>Image:</label>
                            <input
                                className='border border-dark border-2 p-2 form-control mb-4 hand-writing'
                                type='file'
                                accept='image/*'
                                onChange={(event) => handleImageChange(event)}
                            />
                            {project.image && (
                                <div>
                                <img src={project.image} alt='Avatar Preview' width='100' height='100' />
                                </div>
                            )}
                            </div>
                            <div className='text-center hand-writing'>
                                <button
                                    type='submit'
                                    className='btn btn-warning btn-lg'
                                    onClick={addProject}>
                                    Add Project
                                </button>
                    </div>
                        </div>
                        
                        </div>
                        
                    </div>
                    
                    </form>
            </div>
            <div style={{ height: '120px' }}></div>
        </div>
        </div>
    );
};

export default CreateProfilePart2;