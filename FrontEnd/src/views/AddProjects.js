import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProjects = () => {
    const navigate = useNavigate();
    const [project, setProject] = useState({
        name: '',
        description: '',
        techStack: '',
        siteUrl: '',
        repoUrl: '',
        image: '',
    });

    const [showNotification, setShowNotification] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Initialize projectsList with the current user's projects
    const [projectsList, setProjectsList] = useState(currentUser.projectsList || []);


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

    const addProject = () => {
        if (project.name) {
            // Create a copy of the current project
            const newProject = { ...project };

            // Load the Users array from local storage
            const users = JSON.parse(localStorage.getItem('Users'));

            // Find the currently logged in user within the Users array
            const updatedUsers = users.map(user => {
                if (user.username === currentUser.username) {
                    // Update the user's projectsList with the new project
                    user.projectsList.push(newProject);
                }
                return user;
            });

            // Update the Users array in local storage
            localStorage.setItem('Users', JSON.stringify(updatedUsers));

            // Clear the input fields
            setProject({
                name: '',
                description: '',
                techStack: '',
                siteUrl: '',
                repoUrl: '',
                image: '',
            });
            // Manually clear the input file field
            document.getElementById('image-input').value = '';

            // Show the notification
            setShowNotification(true);

            // Hide the notification after a few seconds (e.g., 3 seconds)
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
        }
    };

    return (
        <div className='container fill-screen'>
            <div className='row justify-content-center login'>
                <div className='col-12'>
                    <h2 className='nasa-black text-center text-uppercase mt-3'>
                        Add projects to your Profile
                    </h2>
                    {showNotification && (
                        <div className='notification-overlay'>
                            <div className='alert alert-success' role='alert'>
                                Project added successfully! You can add another one.
                            </div>
                        </div>
                    )}

                    <form>
                        <div className='glass-box border-dark m-3 p-3'>
                            <h4 className="nasa text-uppercase">Add Projects</h4>
                            <div className='row'>
                                <div className='col-md-6'>
                                <label className='fw-bold fs-5'>Name:</label>
                                <input
                                    className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                    type='text'
                                    name='name'
                                    placeholder='Enter Name of Project'
                                    onChange={handleInputChange}
                                    value={project.name} // Add this line to bind the input value
                                />

                                <label className='fw-bold fs-5'>Description:</label>
                                <input
                                    className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                    type='text'
                                    name='description'
                                    placeholder='Enter Description of project'
                                    onChange={handleInputChange}
                                    value={project.description} // Add this line to bind the input value
                                />

                                <label className='fw-bold fs-5'>Tech Stack:</label>
                                <input
                                    className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                    type='text'
                                    name='techStack'
                                    placeholder='Enter the Tech Stack used on Project'
                                    onChange={handleInputChange}
                                    value={project.techStack} // Add this line to bind the input value
                                />
                        </div>
                                <div className='col-md-6'>
                                <label className='fw-bold fs-5'>Site URL:</label>
                                    <input
                                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                        type='text'
                                        name='siteUrl'
                                        placeholder='Enter Site URL'
                                        onChange={handleInputChange}
                                        value={project.siteUrl} // Add this line to bind the input value
                                    />

                                    <label className='fw-bold fs-5'>Repo URL:</label>
                                    <input
                                        className='text-center border border-dark border-2 p-2 form-control mb-2 hand-writing'
                                        type='text'
                                        name='repoUrl'
                                        placeholder='Enter Repo URL'
                                        onChange={handleInputChange}
                                        value={project.repoUrl} // Add this line to bind the input value
                                    />

                                    <label className='fw-bold fs-5'>Image:</label>
                                    <input id='image-input'
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
                            </div>
                            <div className='text-center hand-writing'>
                                <button
                                    type='button'
                                    className='btn btn-warning btn-lg'
                                    onClick={addProject}>
                                    Add Project
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className='text-center hand-writing mt-5'>
                        <button
                            type='button'
                            className='btn btn-warning btn-lg'
                            onClick={() => navigate("/profile")}>
                            View Profile
                        </button>
                    </div>
                </div>
                {/* <div style={{ height: '120px' }}></div> */}
            </div>
        </div>
    );
};

export default AddProjects;