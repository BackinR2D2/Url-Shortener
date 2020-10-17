import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import * as yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import swal from 'sweetalert';

const schema = yup.object().shape({
    email: yup.string().email().trim().required(),
    password: yup.string().max(256).trim().required(),
})

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                    axios.post('https://url-shortener-ra.herokuapp.com/login', { email, password })
                        .then((data) => {
                            if (data.data.status === 'OK') {
                                localStorage.setItem('user_info', JSON.stringify(data.data));
                                const loginbtn = document.querySelector('.loginBtn')
                                const registerbtn = document.querySelector('.registerBtn')
                                const logoutbtn = document.querySelector('.logoutBtn')
                                loginbtn.style.display = 'none';
                                registerbtn.style.display = 'none';
                                logoutbtn.style.display = 'block';
                                history.push('/');
                            }
                        })
                        .catch((err) => {
                            if (err.response.status === 400) {
                                swal("Oops!", "Email or password is wrong", "error");
                            } else {
                                swal("Oops!", "Something went wrong! Try again.", "error");
                            }
                        })
                }
            })
            .catch((err) => {
                // TODO: HANDLE ERROR
                swal("Oops!", "Something went wrong! Try again.", "error");
            })
    }

    return (
        <div className="container centerInp">
            <form className="mainInp">
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
                <div>
                    <small>
                        Do not have an account? Go <Link to="/register">here</Link>.
                    </small>
                </div>
            </form>
        </div>
    )
}

export default Login
