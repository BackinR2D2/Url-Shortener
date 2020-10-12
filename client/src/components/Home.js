import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
}));

const schema = yup.object().shape({
    url: yup.string().trim().url().required(),
    slug: yup.string().trim().max(40).required().matches(/^[\w-]+$/i),
})

function Home() {
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');

    const classes = useStyles();

    const handleButton = (e) => {
        schema.isValid({
            url: url,
            slug: slug
        })
            .then((resp) => {
                if (!resp) {
                    return;
                } else {
                    axios.post('/', { url, slug })
                        .then((data) => {
                            if (data.data.status === 'OK') {
                                alert('Link created.');
                            }
                        })
                        .catch((err) => {
                            // TODO: HANDLE ERROR
                            // alert with error message
                            console.log(err);
                        })
                }
            })
            .catch((err) => {
                // TODO: HANDLE ERROR
                console.log(err);
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
