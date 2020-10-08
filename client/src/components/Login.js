import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const schema = yup.object().shape({
    email: yup.string().email().trim().required(),
    password: yup.string().max(256).trim().required(),
})

function Login() {
    const history = useHistory();
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
                if (!resp) {
                    return;
                } else {
                    axios.post('/login', { email, password })
                        .then((data) => {
                            console.log(data);
                            if (data.data.status === 'OK') {
                                localStorage.setItem('user_info', JSON.stringify(data.data));
                                history.push('/');
                            }
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
                    <TextField label="Email" variant="outlined" name="email" type="email" onChange={handleEmail} required />
                </div>
                <div>
                    <TextField label="Password" variant="outlined" name="password" type="password" onChange={handlePassword} required />
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
