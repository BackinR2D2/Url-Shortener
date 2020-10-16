import React from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';

function Navbar() {
    const history = useHistory();
    const listStyle = () => {
        const ul = document.querySelector('ul');
        window.onresize = displayWindowSize;
        window.onload = displayWindowSize;

        function displayWindowSize() {
            let myWidth = window.innerWidth;
            if (myWidth > 991) {
                ul.removeAttribute('data-target');
            }
            if (myWidth <= 991) {
                ul.setAttribute('data-target', '.navbar-collapse');
            }
        }
    }


    const logout = () => {
        axios.delete('/logout')
            .then((resp) => {
                if (resp.data.status === 'OK') {
                    localStorage.removeItem('user_info');
                    const loginbtn = document.querySelector('.loginBtn')
                    const registerbtn = document.querySelector('.registerBtn')
                    const logoutbtn = document.querySelector('.logoutBtn')
                    loginbtn.style.display = 'block';
                    registerbtn.style.display = 'block';
                    logoutbtn.style.display = 'none';
                    history.push('/login');
                }
            })
            .catch((err) => {
                // TODO: HANDLE ERROR
                console.log(err);
            })
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Url Shortener</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav" data-toggle="collapse" data-target=".navbar-collapse" ref={listStyle} >
                    <li className="nav-item active" >
                        <Link className="nav-link" to="/" >Home</Link>
                    </li>
                    <li className="nav-item active" >
                        <Link className="nav-link" to="/account">Account</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link loginBtn" to="/login">Log in</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link registerBtn" to="/register">Sign in</Link>
                    </li>
                    <li className="nav-item active">
                        <Button className="logoutBtn " variant="contained" color="secondary" onClick={logout}>
                            Log out
                        </Button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
