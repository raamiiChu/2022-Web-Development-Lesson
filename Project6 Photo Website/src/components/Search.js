import React from "react";

const Search = ({ setInput, search }) => {
    const inputHandler = (e) => {
        setInput(e.target.value);
    };

    return (
        <div className="search">
            <form>
                <input type="text" onChange={inputHandler} />
                <button type="submit" onClick={search}>
                    Search
                </button>
            </form>
        </div>
    );
};

export default Search;
