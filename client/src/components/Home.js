import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

function Home() {
    const classes = useStyles();
    return (
        <div>
            <form className={classes.root}>
                <div>
                    <TextField id="standard-basic" label="Url" name="url" />
                </div>
                <div>
                    <TextField id="standard-basic" label="Slug" name="slug" />
                </div>
                <div>
                    <Button variant="outlined" color="primary">
                        Generate
                </Button>
                </div>
            </form>
        </div>
    )
}

export default Home
