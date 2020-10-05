import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import * as yup from 'yup';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().max(256).required(),
})

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const classes = useStyles();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleLogin = () => {
        schema.isValid({
            email: email,
            password: password
        })
            .then((resp) => {
                console.log(resp);
                if (!resp) {
                    return;
                } else {
                    axios.post('/login', { email, password })
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

    return (
        <div>
            <form className={classes.root}>
                <div>
                    <TextField id="outlined-basic" label="Email" variant="outlined" name="email" type="email" onChange={handleEmail} required />
                </div>
                <div>
                    <TextField id="outlined-basic" label="Password" variant="outlined" name="password" type="password" onChange={handlePassword} required />
                </div>
                <div>
                    <Button variant="outlined" color="primary" onClick={handleLogin}>
                        Login
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Login
