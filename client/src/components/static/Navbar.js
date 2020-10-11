import React from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Navbar() {
    const history = useHistory();

    const logout = () => {
        axios.delete('/logout')
            .then((resp) => {
                if (resp.data.status === 'OK') {
                    localStorage.removeItem('user_info');
                    history.push('/login');
                }
            })
            .catch((err) => {
                // TODO: HANDLE ERROR
                console.log(err);
            })
    }

    return (
        // <div className="navbar">
        //     <Link to="/">Homepage</Link>
        //     <Link to="/account">Account</Link>
        //     <Link to="/register">Register</Link>
        //     <Link to="/login">Login</Link>
        //     <button onClick={logout}>Logout</button>
        // </div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Url Shortener</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-link" to="/">Homepage</Link>
                    <Link className="nav-link" to="/account">Account</Link>
                    <Link className="nav-link" to="/register">Sign in</Link>
                    <Link className="nav-link" to="/login">Log in</Link>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
