import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import defaultProject from '../images/win95.png';

// Create an Axios instance with a base URL and credentials
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

const ProjectDetails = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [project, setProject] = useState(null);
  const baseAvatarUrl = 'http://127.0.0.1:8000';
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [transition, setTransition] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [fadeButton, setFadeButton] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useLocation().state;

  useEffect(() => {
    // Retrieve project from location state
    const fetchProjectDetails = async () => {
      try {
        // Assuming your API endpoint for fetching project details is like '/api/projects/:projectId'
        const response = await api.get(`users/projects/${projectId}`);
        const projectDetails = response.data; // Adjust this based on your API response structure
        setProject(projectDetails);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  // useEffect(() => {
  //   // Update the state when location.state.project changes
  //   setProject(location.state?.project);
  // }, [location.state?.project]);

  if (!project) {
    return <p>Loading...</p>;
  }

  const confirmDelete = () => {
    setFadeButton(true);
    setTimeout(() => {
      setConfirmation(true);
    }, 1000);
  }

  const cancelDelete = () => {
    setFadeButton(false);
    setTimeout(() => {
      setConfirmation(false);
    }, 1000);
  }

  const deleteProject = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.data.token}`,
        },
      };
      const response = await api.delete(`users/delete-project/${project.id}/`, config);
      const displayMessage = () => {
            setTimeout(() => {
                setTransition(true)
                setTimeout(() => {
                    navigate('/profile');
                }, 1000);
            }, 1750);
        }
      
      if (response) {
        setShouldSlideOut(true);
        setTimeout(() => {
            setSuccessMessage(true)
            displayMessage();
        }, 1000);
    }
    } catch (error) {
        console.error('Error deleting project:', error);
    }
  };

  const editProject = () => {
    setShouldSlideOut(true);
      setTimeout(() => {
        navigate('/add-projects', { state: { project } });
      }, 1000);
  };


  return  (
    <div className="container mt-4 fill-screen mb-2">
      {!successMessage ? (
      <div className={`row justify-content-evenly ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
        <h2 className={`header-font text-center text-uppercase mt-3 ${shouldSlideOut ? 'animate-slide-out-top' : 'animate-slide-top'}`}>
          {project.name}
        </h2>

        <div className="col-10 glass-box">
          <div className="row">
            <div className="col-md-6 col-12">
              {project.image ? (
                <img
                  src={`${baseAvatarUrl}${project.image}`} 
                  alt={`Project ${project.name}`}
                  className="project-image-large rounded"
                  style={{ display: 'block' }}
                />
              ) : (
                <img
                  src={defaultProject}
                  alt={`Project ${project.name}`}
                  className="project-image-large rounded"
                  style={{ display: 'block' }}
                />
              )}
            </div>
            <div className="col-md-6 col-12">
              <p className="header-font text-uppercase mt-1">Description:</p>
              <p className="header-font mt-1">
                {project.description}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-12">
              <p className="header-font text-uppercase">Tech Stack:</p>
              <p className="header-font">{project.tech_stack}</p>
            </div>
            <div className="col-md-6 col-12">
              <div className="text-center hand-writing mt-3">
                {project.site_url && (
                  <a
                    href={project.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm mb-3 mx-2"
                  >
                    View Site
                  </a>
                )}
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm mb-3 mx-2"
                  >
                    View Repo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='text-center mt-2 mb-1 hand-writing'>
          {!confirmation ? (
            <div className={`${fadeButton ? 'fade-out' : 'fade-in'}`}>
              <button
                className={`btn btn-warning btn-lg mx-2 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}
                onClick={() => {
                  setShouldSlideOut(true);
                  setTimeout(() => {
                    navigate('/profile');
                    }, 1000);
                  }}
              >
                Profile
              </button>
              <button
                className={`btn btn-primary btn-lg mx-2 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}
                onClick={editProject}
              >
                Edit
              </button>
              <button
                className={`btn btn-danger btn-lg mx-2 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          ) : (
            <div className={`${fadeButton ? 'fade-in' : 'fade-out'}`}>
              <button
                className={`btn btn-warning btn-lg mx-2 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className={`btn btn-danger btn-lg mx-2 ${shouldSlideOut ? 'animate-slide-out-bottom' : 'animate-slide-bottom'}`}
                onClick={deleteProject}
              >
                Confirm?
              </button>
              <p className="glass-box text-danger fw-bold mt-2 fs-5 col-6 m-auto">
                This will permanently delete this project....
              </p>
            </div>
          )}
        </div>
      </div>
      ) : (
        <div className={`row justify-content-center mt-5 header-font ${ transition ? 'fade-out' : 'fade-in'}`}> 
        <div className="col-5 mt-5 glass-box">
            <h2 className={`header-font mt-2 text-center text-uppercase fade-in p-3 m-3 ${shouldSlideOut ? 'fade-out' : 'fade-in'}`}>
                Project Deleted!
                <br />
                <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} className='fs-1' />
            </h2>
        </div>
    </div>
      )}
    </div>
  );
};

export default ProjectDetails;