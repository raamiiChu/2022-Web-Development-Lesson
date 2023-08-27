import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Create = ({ messages, setMessages }) => {
    let [input, setInput] = useState("");

    const inputHandler = (e) => {
        console.log(e.target.value);
        setInput(e.target.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setMessages([...messages, { input, id: uuidv4() }]);
        setInput(""); // 清空文字欄
    };

    return (
        <form>
            <input onChange={inputHandler} value={input} type="text" />
            <button type="submit" onClick={submitHandler}>
                Submit
            </button>
        </form>
    );
};

export default Create;
