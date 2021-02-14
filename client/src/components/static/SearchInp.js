import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';

function SearchInp({ posts, updateFilteredPosts, isChanged }) {

    const [inp, setInp] = useState('');

    const handleInput = (e) => {
        setInp(e.target.value);
        const item = (e.currentTarget.value).toLowerCase().trim().replace(/ +/g, "");
        const filteredPosts = posts.filter(post => post.slug.toLowerCase().includes(item))
        updateFilteredPosts(filteredPosts);
    }

    return (
        <div>
            <TextField
                id="standard-multiline-flexible"
                label="Search by slug"
                multiline
                value={isChanged ? '' : inp}
                rowsMax={4}
                onChange={handleInput}
            />
        </div>
    )
}

export default SearchInp
