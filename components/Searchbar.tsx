"use client"

import { FormEvent, useState } from "react"

const isValidSearchQuery = (query:string) => {

    if(query.length < 2) {
        alert("Please enter at least 2 characters");
        return false;
    }

    return true;
}
const Searchbar = () => {
    const [searchPrompt, setSearchPrompt] = useState("");

    const handleSubmit = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        //const isValidLink = isValidSearchQuery(searchPrompt);
        console.log(searchPrompt);
    }

    return (
    <form className="flex flex-wrap gap-4 mt-12"
    onSubmit={handleSubmit}
    >
        <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Search for artists"
        className="searchbar-input"
        />

        <button type="submit" className="searchbar-btn">
        Search
        </button>
    </form>
    )
}

export default Searchbar