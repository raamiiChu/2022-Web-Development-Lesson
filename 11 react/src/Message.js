import React from "react";

const Message = ({ msg, messages, setMessages }) => {
    const deleteHandler = (e) => {
        e.preventDefault();
        setMessages(
            messages.filter((m) => {
                return m.id !== msg.id;
            })
        );
    };

    return (
        <div style={{ backgroundColor: "black", color: "white" }}>
            <p>{msg.input}</p>
            <button onClick={deleteHandler}>Delete</button>
        </div>
    );
};

export default Message;
