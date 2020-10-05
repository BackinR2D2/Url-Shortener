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
            width: '25ch',
        },
    },
}));

const schema = yup.object().shape({
    url: yup.string().trim().url().required(),
    slug: yup.string().trim().max(40),
})

function Home() {
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');

    const classes = useStyles();

    const handleButton = (e) => {
        //e.preventDefault();
        schema.isValid({
            url: url,
            slug: slug
        })
            .then((data) => {
                console.log(data);
                if (!data) {
                    return;
                } else {
                    axios.post('/', { url, slug })
                        .then((data) => {
                            console.log(data);
                        })
                        .catch((err) => {
                            // TODO: HANDLE ERROR
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
        <div>
            <form className={classes.root}>
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
