import React from "react";

const Friend = ({ name, age, desc }) => {
    return (
        <div>
            <h2>Name: {name}</h2>
            <h3>Age: {age}</h3>
            <p>Description: {desc}</p>
        </div>
    );
};

export default Friend;
