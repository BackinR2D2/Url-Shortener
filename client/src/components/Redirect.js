import React, { useState, useEffect } from 'react';
import axios from 'axios';

const id = window.location.href.split('/')[3];

function Redirect() {
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState('');
    useEffect(() => {
        let isActive = true;
        axios.get(`/${id}/url`)
            .then((resp) => {
                console.log(resp.data.url);
                setUrl(resp.data.url);
                setLoading(false);
            })
            .catch((err) => {
                // TODO: HANDLE ERROR
                console.log(err);
            })

        return () => {
            isActive = false;
        }
    }, [])

    return (
        <div>
            {
                loading === true ?
                    <p>Loading...</p>
                    :
                    <div>
                        {window.location.href = url}
                    </div>
            }
        </div>
    )
}

export default Redirect
