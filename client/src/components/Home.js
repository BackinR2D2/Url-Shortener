import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as yup from 'yup';
import axios from 'axios';
import swal from 'sweetalert';
import config from './static/config';

const schema = yup.object().shape({
    url: yup.string().trim().url().required(),
    slug: yup.string().trim().max(40).required().matches(/^[\w-]+$/i),
})

function Home() {
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');

    useEffect(() => {
        const loginbtn = document.querySelector('.loginBtn')
        const registerbtn = document.querySelector('.registerBtn')
        const logoutbtn = document.querySelector('.logoutBtn')
        loginbtn.style.display = 'none';
        registerbtn.style.display = 'none';
        logoutbtn.style.display = 'block';
    }, [])



    const handleButton = (e) => {
        schema.isValid({
            url: url,
            slug: slug
        })
            .then((resp) => {
                if (!resp) {
                    return;
                } else {
                    axios.post(`${config.URL}/`, { url, slug }, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                        .then((data) => {
                            if (data.data.status === 'OK') {
                                swal("Link created", "Your url has been created, go to account to check it out.", "success");
                            }
                        })
                        .catch((err) => {
                            if (err.response.status === 403) {
                                swal("Oops!", "Not authorized, you have to log in again :(", "error");
                            } else {
                                swal("Oops!", "Slug is already in use!", "error");
                            }
                        })
                }
            })
            .catch((err) => {
                swal("Oops!", "Something went wrong! Try again.", "error");
            })
    }

    const handleUrl = (e) => {
        setUrl(e.target.value);
    }

    const handleSlug = (e) => {
        setSlug(e.target.value);
    }

    return (
        <div className="container centerInp">
            <form className="mainInp">
                <div>
                    <TextField id="standard-basic" label="Url" name="url" onChange={handleUrl} />
                </div>
                <div>
                    <TextField id="standard-basic" label="Slug" name="slug" onChange={handleSlug} />
                </div>
                <div>
                    <Button variant="outlined" color="primary" onClick={handleButton}>
                        Generate
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Home
