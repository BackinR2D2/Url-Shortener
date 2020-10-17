import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './static/Loader';
const id = window.location.href.split('/')[3];

function Redirect() {
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState('');
    useEffect(() => {
        let isActive = true;
        axios.get(`https://url-shortener-ra.herokuapp.com/${id}/url`)
            .then((resp) => {
                if (isActive) {
                    console.log(resp.data.url);
                    setUrl(resp.data.url);
                    setLoading(false);
                }
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
                    <div className="loader container mainInp centerInp">
                        <Loader />
                    </div>
                    :
                    <div className="url container mainInp centerInp">
                        <p>Url: {window.location.href = url}</p>
                    </div>
            }
        </div>
    )
}

export default Redirect
