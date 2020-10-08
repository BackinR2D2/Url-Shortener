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
        <div className="navbar">
            <Link to="/">Homepage</Link>
            <Link to="/account">Account</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Navbar
