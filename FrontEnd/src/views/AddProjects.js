import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// Create an Axios instance with a base URL and credentials
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true,
});

const AddProjects = () => {
    const [shouldSlideOut, setShouldSlideOut] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [projectSaved, setProjectSaved] = useState(false);
    const [updatedInfo, setUpdatedInfo] = useState({});
    const [buttonTxt, setButtonTxt] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const returnUrl = location.state ? location.state.returnUrl : null;
    const projectUrl = location.state ? location.state.project.id : null;

    useEffect(() => {
        if (location.state && location.state.project) {
            const existingProject = location.state.project;
            // Use existingProject to prepopulate input fields for editing
            setProject({
                name: existingProject.name || '',
                description: existingProject.description || '',
                site_url: existingProject.site_url || '',
                repo_url: existingProject.repo_url || '',
                tech_stack: existingProject.tech_stack || '',
                image: null, // Handle image separately if needed
            });
        }
    }, [location.state]);

    // Initialize the project state
    const [project, setProject] = useState({
        name: '',
        description: '',
        site_url: '',
        repo_url: '',
        tech_stack: '',
        image: null,
    });

    // Function to handle changes to the inputs in the form
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProject((prevProject) => ({ ...prevProject, [name]: value }));
    };

    // Function to handle image change
    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            // Create a new FileReader object
            const reader = new FileReader();

            // Set up an event handler for when the FileReader has loaded the file
            reader.onload = (e) => {
                // Update the state using the setProject function
                setProject((prevProject) => ({
                    ...prevProject,
                    image: file,
                }));
            };

            // Read the file as a data URL (base64-encoded string)
            reader.readAsDataURL(file);
        } else {
            // Clear the value of the file input if no file is selected (image is cleared)
            event.target.value = '';
        }
    };

    // Function to handle clearing the image field
    const clearImageField = () => {
        setProject((prevProject) => ({
        ...prevProject,
        image: null,
        }));
    
        // Clear the value of the file input
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
        imageInput.value = '';
        }
    };

    // Function to validate the form
    const validateForm = () => {
        const validationErrors = {};

        if (!project.name) validationErrors.name = 'Project name is required';
        if (!project.description) validationErrors.description = 'Project description is required';
        if (!project.site_url) validationErrors.site_url = 'Site URL is required';
        if (!project.repo_url) validationErrors.repo_url = 'Repo URL is required';
        if (!project.tech_stack) validationErrors.tech_stack = 'Tech Stack is required';

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Function to add the project to the database
    const addProject = async () => {
        try {
            // Validate the form
            const isFormValid = validateForm();

            if (!isFormValid) {
                console.error('Validation errors:', errors);
                return;
            }

            // Clear previous errors
            setErrors({});

            const formData = new FormData();
            // Append avatar file to the form data if available
            if (project.image) {
                formData.append('image', project.image, 'project_image.jpg');
            }
            // Append project fields to the form data
            Object.entries(project).forEach(([key, value]) => {
                if (value !== null && key !== 'image') {
                    formData.append(key, value);
                }
            });

            // Configuration for the API request, including authorization header
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', // This line is needed for file uploads
                    Authorization: `Bearer ${currentUser.data.token}`,
                },
            };

            // Make a POST request to add the project
            // await api.post('users/add_project/', formData, config);
            if (location.state && location.state.project) {
                let projectId = location.state.project.id;
                // If project ID exists, it means we are updating an existing project
                // Make a PUT request to update the project
                await api.put(`users/update_project/${projectId}/`, formData, config);
                setUpdatedInfo({ ...project, ...formData });
                setTimeout(() => {
                    returnToProject();
                }, 500);
            } else {
                // If project ID doesn't exist, it means we are adding a new project
                // Make a POST request to add the project
                await api.post('users/add_project/', formData, config);
            }

            // Clear the input fields and initiate animations on the form
            setIsSubmitted(true);
            setTimeout(() => {
                setProject({
                    name: '',
                    description: '',
                    site_url: '',
                    repo_url: '',
                    tech_stack: '',
                    image: null,
                });
                setProjectSaved(true);
                clearImageField();
                setButtonTxt(false);
                setIsSubmitted(false);
            }, 1000);
        } catch (error) {
            console.error('Error adding project:', error);
            console.log('Error response from server:', error.response);
            setErrors({ 
                general: 
                "Whoops, looks like there's a problem adding your project. Please try again later." });
            setTimeout(() => {
                navigate('/profile');
            }, 3000);
        }
    };

    const returnToProfile = () => {
        setShouldSlideOut(true);
        setTimeout(() => {
            navigate(returnUrl || '/profile');
        }, 1000);
    };

    const returnToProject = () => {
        setShouldSlideOut(true);
        setTimeout(() => {
            navigate(`/project/${projectUrl}`, { state: { projectId: projectUrl } });
        }, 1000);
    };

    return (
        <div className='container fill-screen'>
            <div className={`row justify-content-center login ${isSubmitted ? 'fade-out' : 'fade-in'}`}>
            {errors.general && (
            <div className='notification-overlay fs-3'>
                <div className='alert alert-danger' role='alert'>
                    {errors.general}
                </div>
            </div>
            )}
                <div className={`col-10 col-lg-8 mt-5 ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>

                    <form encType="multipart/form-data">
                        <div className='glass-box border-dark m-3 p-3'>
                            <h4 className="header-font text-uppercase text-center">Add a Project</h4>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <label className='fw-bold fs-5'>Name:</label>
                                    <input
                                        className={`text-center border border-dark border-2 p-2 form-control mb-2 hand-writing ${errors.name ? 'is-invalid' : ''}`}
                                        type='text'
                                        name='name'
                                        placeholder='Enter Name of Project'
                                        onChange={handleInputChange}
                                        value={project.name}
                                    />
                                    {errors.name && (
                                        <div className='invalid-feedback'>{errors.name}</div>
                                    )}

                                    <label className='fw-bold fs-5'>Description:</label>
                                    <input
                                        className={`text-center border border-dark border-2 p-2 form-control mb-2 hand-writing ${errors.description ? 'is-invalid' : ''}`}
                                        type='text'
                                        name='description'
                                        placeholder='Enter Description of project'
                                        onChange={handleInputChange}
                                        value={project.description}
                                    />
                                    {errors.description && (
                                        <div className='invalid-feedback'>{errors.description}</div>
                                    )}

                                    <label className='fw-bold fs-5'>Tech Stack:</label>
                                    <input
                                        className={`text-center border border-dark border-2 p-2 form-control mb-2 hand-writing ${errors.tech_stack ? 'is-invalid' : ''}`}
                                        type='text'
                                        name='tech_stack'
                                        placeholder='Enter the Tech Stack used on Project'
                                        onChange={handleInputChange}
                                        value={project.tech_stack}
                                    />
                                    {errors.tech_stack && (
                                        <div className='invalid-feedback'>{errors.tech_stack}</div>
                                    )}
                                </div>
                                <div className='col-md-6'>
                                    <label className='fw-bold fs-5'>Site URL:</label>
                                    <input
                                        className={`text-center border border-dark border-2 p-2 form-control mb-2 hand-writing ${errors.site_url ? 'is-invalid' : ''}`}
                                        type='text'
                                        name='site_url'
                                        placeholder='Enter Site URL'
                                        onChange={handleInputChange}
                                        value={project.site_url}
                                    />
                                    {errors.site_url && (
                                        <div className='invalid-feedback'>{errors.site_url}</div>
                                    )}

                                    <label className='fw-bold fs-5'>Repo URL:</label>
                                    <input
                                        className={`text-center border border-dark border-2 p-2 form-control mb-2 hand-writing ${errors.repo_url ? 'is-invalid' : ''}`}
                                        type='text'
                                        name='repo_url'
                                        placeholder='Enter Repo URL'
                                        onChange={handleInputChange}
                                        value={project.repo_url}
                                    />
                                    {errors.repo_url && (
                                        <div className='invalid-feedback'>{errors.repo_url}</div>
                                    )}

                                    <label className='fw-bold fs-5'>Image (Upload):</label>
                                    <input
                                        id="imageInput"
                                        className={`border border-dark border-2 p-2 form-control mb-3 hand-writing`}
                                        name='image'
                                        type='file'
                                        accept='image/*'
                                        onChange={handleImageChange}
                                    />
                                    {project.image && (
                                        <div>
                                            <img src={URL.createObjectURL(project.image)} alt='Preview' width='100' height='100' />
                                            <button
                                                type='button'
                                                className='btn btn-danger btn-sm ms-2'
                                                onClick={clearImageField}
                                                >
                                                Clear Image
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='text-center hand-writing'>
                                <button
                                    type='button'
                                    className='btn btn-warning btn-lg'
                                    onClick={addProject}>
                                    {buttonTxt ? 'Add Project' : 'Add Another?'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className='text-center hand-writing mt-5 animate-slide-bottom'>
                    {location.state && location.state.project ? (
                        <button
                        type='button'
                        className={`btn btn-warning btn-lg ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}
                        onClick={returnToProject}
                        >
                        Back to Project
                        </button>
                    ) : (
                        <button
                            type='button'
                            className={`btn btn-warning btn-lg ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}
                            onClick={returnToProfile}
                        >
                            {returnUrl ? 'Back' : 'Skip'}
                        </button>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProjects;