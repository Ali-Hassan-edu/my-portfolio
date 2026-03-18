import React, { useState } from 'react';
import './AppProjects.css';

const AppProjects = ({ projects }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    const openModal = (project) => {
        setSelectedProject(project);
    };

    const closeModal = () => {
        setSelectedProject(null);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    };

    React.useEffect(() => {
        if (selectedProject) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedProject]);

    return (
        <div className='thumbnail-grid'>
            {projects.map((project, index) => (
                <div key={project.id} className='thumbnail' onClick={() => openModal(project)}>
                    <img src={project.thumbnail} alt={project.title} />
                </div>
            ))}

            {selectedProject && (
                <div className='modal' onClick={closeModal}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <span className='close' onClick={closeModal}>&times;</span>
                        <img src={selectedProject.image} alt={selectedProject.title} />
                        <div className='prev-next'>
                            <button onClick={() => setSelectedProject(projects[(projects.indexOf(selectedProject) - 1 + projects.length) % projects.length])}>Prev</button>
                            <button onClick={() => setSelectedProject(projects[(projects.indexOf(selectedProject) + 1) % projects.length])}>Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppProjects;
