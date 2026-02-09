import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="video-container">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          /* REPLACE THIS URL WITH YOUR VIDEO PATH */
          src="./assets/loader.mp4" 
        />   
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh; /* Full viewport height */
  background-color: #ffffff; /* White background */
  overflow: hidden; /* Prevent scrolling during load */

  .video-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  video {
    /* object-fit: cover; -> Crops video to fill screen (good for backgrounds)
       object-fit: contain; -> Shows full video without cropping (good for logos)
    */
    object-fit: contain; 
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    
    /* Optional: Limit size on larger screens so it doesn't get too pixelated */
    @media (min-width: 1024px) {
       max-width: 60%; 
    }
  }
`;

export default Loader;