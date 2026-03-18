import React, { useState } from 'react';
import Modal from 'react-modal';

const AppProjects = ({ app }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const goToPrevious = () => {
    setCurrentImageIndex((currentImageIndex - 1 + app.screenshots.length) % app.screenshots.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((currentImageIndex + 1) % app.screenshots.length);
  };

  return (
    <div className="gallery">
      <div className="thumbnail-grid">
        {app.screenshots.map((screenshot, index) => (
          <img 
            key={index} 
            src={screenshot} 
            alt={`Screenshot ${index}`} 
            onClick={() => openModal(index)} 
            className="thumbnail" 
          />
        ))}
      </div>

      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        <button onClick={closeModal}>Close</button>
        <button onClick={goToPrevious} disabled={currentImageIndex === 0}>Previous</button>
        <button onClick={goToNext} disabled={currentImageIndex === app.screenshots.length - 1}>Next</button>
        <img src={app.screenshots[currentImageIndex]} alt={`Screenshot ${currentImageIndex}`} />
      </Modal>
    </div>
  );
};

export default AppProjects;