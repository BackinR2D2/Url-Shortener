import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
}));

export default function Loader() {
    const classes = useStyles();

    return (
        <div className="center">
            <CircularProgress size={100} thickness={6} />
        </div>
    );
}