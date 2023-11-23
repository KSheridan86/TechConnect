import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const baseAvatarUrl = 'http://127.0.0.1:8000';
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve project from location state
    const projectDetails = location.state?.project;

    if (projectDetails) {
      setProject(projectDetails);
    }
  }, [location.state?.project]);
  if (!project) {
    return <p>Loading...</p>;
  }

  // Render your ProjectDetails component with the selected project data
  return  (
    <div className="container mt-4 fill-screen mb-2">
      <div className={`row justify-content-evenly ${shouldSlideOut ? 'animate-slide-out-right' : 'animate-slide-left'}`}>
        <h2 className={`nasa-black text-center text-uppercase mt-3 ${shouldSlideOut ? 'animate-slide-out-top' : 'animate-slide-top'}`}>
          Project Details: {project.name}
        </h2>

        <div className="col-10 glass-box">
          <div className="row">
            <div className="col-md-6 col-12">
              {project.image && (
                <img
                  src={`${baseAvatarUrl}${project.image}`} 
                  alt={`Project ${project.name}`}
                  className="project-image-large rounded"
                  style={{ display: 'block' }}
                />
              )}
            </div>
            <div className="col-md-6 col-12">
              <p className="nasa-black text-uppercase mt-1">Description:</p>
              <p className="nasa-black mt-1">
                {project.description}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-12">
              <p className="nasa-black text-uppercase">Tech Stack:</p>
              <p className="nasa-black">{project.tech_stack}</p>
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
        </div>
        
      </div>
    </div>
  );
};

export default ProjectDetails;

