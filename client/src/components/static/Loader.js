import React, { useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Loader() {

    useEffect(() => {
        const loginbtn = document.querySelector('.loginBtn')
        const registerbtn = document.querySelector('.registerBtn')
        const logoutbtn = document.querySelector('.logoutBtn')
        loginbtn.style.display = 'none';
        registerbtn.style.display = 'none';
        logoutbtn.style.display = 'block';
    }, [])

    return (
        <div className="center">
            <CircularProgress size={100} thickness={2} />
        </div>
    );
}