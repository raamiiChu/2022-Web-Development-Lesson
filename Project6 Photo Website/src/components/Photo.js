import React from "react";

const Photo = ({ photo }) => {
    return (
        <div className="photo">
            <p>Photographer: {photo.photographer}</p>
            <div className="image-container">
                <img src={photo.src.large} alt={photo.alt} />
            </div>
            <p>
                <a href={photo.url} target="_blank" rel="noreferrer">
                    Download Image
                </a>
            </p>
        </div>
    );
};

export default Photo;
