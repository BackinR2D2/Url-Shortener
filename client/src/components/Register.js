import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import * as yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import swal from 'sweetalert';
import config from './static/config';

const schema = yup.object().shape({
    email: yup.string().email().trim().required(),
    password: yup.string().max(256).trim().required(),
    confirmPass: yup.string().max(256).trim().required(),
})

const nrSchema = yup.object().shape({
    nr: yup.number().max(10000).positive().integer().required()
})

function Register() {
    const history = useHistory();
    const [open, setOpen] = React.useState(true);
    const [inp, setInp] = React.useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isModal, setIsModal] = useState(false);
    const [errMsg, setErrMsg] = useState(false);

    useEffect(() => {
        const loginbtn = document.querySelector('.loginBtn')
        const registerbtn = document.querySelector('.registerBtn')
        const logoutbtn = document.querySelector('.logoutBtn')
        loginbtn.style.display = 'none';
        registerbtn.style.display = 'none';
        logoutbtn.style.display = 'block';
    }, [])

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPass(e.target.value);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleInp = (e) => {
        setInp(e.target.value);
    }

    const verify = () => {
        nrSchema.isValid({
            nr: inp
        })
            .then((res) => {
                if (!res) {
                    return;
                } else {
                    axios.post(`${config.URL}/register/verify`, { inp, email, password })
                        .then((res) => {
                            if (res.data.status === 'OK') {
                                history.push('/login');
                            }
                        })
                        .catch((err) => {
                            setErrMsg(true);
                        })
                }
            })
            .catch((er) => {
                swal("Oops!", "Something went wrong! Try again.", "error");
            })
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
                        axios.post(`${config.URL}/register`, { email, password })
                            .then((data) => {
                                if (data.data.status === 'OK') {
                                    setIsModal(true);
                                    setOpen(true);
                                }
                            })
                            .catch((err) => {
                                // TODO: HANDLE ERROR
                                setIsModal(false);
                                if (err.response.status === 400) {
                                    swal("Oops!", "Email is already registered.", "error");
                                } else {
                                    swal("Oops!", "Something went wrong! Try again.", "error");
                                }
                            })
                    } else {
                        return;
                    }
                }
            })
            .catch((err) => {
                // TODO: HANDLE ERROR
                swal("Oops!", "Something went wrong! Try again.", "error");
            })
    }

    return (
        <div>
            <div className="container centerInp">
                <form className="mainInp">
                    <div>
                        <TextField label="Email" variant="outlined" name="email" type="email" onChange={handleEmail} required />
                    </div>
                    <div>
                        <TextField label="Password" variant="outlined" name="password" type="password" onChange={handlePassword} required />
                    </div>
                    <div>
                        <TextField label="Confirm Password" variant="outlined" name="confirmPassword" type="password" onChange={handleConfirmPassword} required />
                    </div>
                    <div>
                        <Button variant="outlined" color="primary" onClick={handleRegister}>
                            Register
                        </Button>
                    </div>
                    <div>
                        <small>
                            Already have an account? Go <Link to="/login">here</Link>.
                        </small>
                    </div>
                </form>
            </div>
            {
                isModal === true ?
                    <div>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">
                                <p className="dialogTitle">Verify Code</p>
                            </DialogTitle>
                            <DialogContent>
                                <div className="dfac">
                                    <TextField id="outlined-basic" label="Code" variant="outlined" onChange={handleInp} required />
                                    <Button variant="contained" color="primary" onClick={verify}>
                                        Verify
                                    </Button>
                                </div>
                                <div className="errMsg">
                                    {
                                        errMsg === true ?
                                            <small>
                                                Wrong code
                                            </small>
                                            :
                                            <></>
                                    }
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}

export default Register
