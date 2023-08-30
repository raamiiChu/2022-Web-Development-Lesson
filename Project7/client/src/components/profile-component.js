import React from "react";

const ProfileComponent = ({ currentUser }) => {
    return (
        <div style={{ padding: "3rem" }}>
            {!currentUser && <h1>You must login first</h1>}

            {currentUser && (
                <div>
                    <h1>Profile Page</h1>
                    <header className="jumbotron"></header>
                    <h3>
                        <strong>{currentUser.user.userName}</strong>
                    </h3>
                </div>
            )}
        </div>
    );
};

export default ProfileComponent;
