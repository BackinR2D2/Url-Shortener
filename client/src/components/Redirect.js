import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './static/Loader';
import config from './static/config';
import swal from 'sweetalert';
const id = window.location.href.split('/')[3];

function Redirect() {
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState('');
    useEffect(() => {
        let isActive = true;
        axios.get(`${config.URL}/${id}/url`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then((resp) => {
                if (isActive) {
                    setUrl(resp.data.url);
                    setLoading(false);
                }
            })
            .catch((err) => {
                // TODO: HANDLE ERROR
                swal("Oops!", "Something went wrong! Try again.", "error");
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
