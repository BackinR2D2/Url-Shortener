import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Loader() {

    return (
        <div className="center">
            <CircularProgress size={100} thickness={6} />
        </div>
    );
}