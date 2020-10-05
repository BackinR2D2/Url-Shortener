import React from 'react'
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className="navbar">
            <Link to="/">Homepage</Link>
            <Link to="/account">Account</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <button>Logout</button>
        </div>
    )
}

export default Navbar
