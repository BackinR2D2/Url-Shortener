import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

function Login() {
    const classes = useStyles();
    return (
        <div>
            <form className={classes.root}>
                <div>
                    <TextField id="outlined-basic" label="Email" variant="outlined" name="email" type="email" required />
                </div>
                <div>
                    <TextField id="outlined-basic" label="Password" variant="outlined" name="password" type="password" required />
                </div>
                <div>
                    <Button variant="outlined" color="primary">
                        Login
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Login
