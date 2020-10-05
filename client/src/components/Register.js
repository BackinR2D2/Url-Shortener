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
    email: yup.string().email().trim().required(),
    password: yup.string().max(256).trim().required(),
    confirmPass: yup.string().max(256).trim().required(),
})

function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const classes = useStyles();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPass(e.target.value);
    }

    const handleRegister = () => {
        schema.isValid({
            email: email,
            password: password,
            confirmPass: confirmPass,
        })
            .then((resp) => {
                if (!resp) {
                    return;
                } else {
                    if (confirmPass === password) {
                        axios.post('/register', { email, password })
                            .then((data) => {
                                console.log(data);
                            })
                            .catch((err) => {
                                // TODO: HANDLE ERROR
                                console.log(err);
                            })
                    } else {
                        return;
                    }
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
                    <TextField id="outlined-basic" label="Confirm Password" variant="outlined" name="confirmPassword" type="password" onChange={handleConfirmPassword} required />
                </div>
                <div>
                    <Button variant="outlined" color="primary" onClick={handleRegister}>
                        Register
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Register
