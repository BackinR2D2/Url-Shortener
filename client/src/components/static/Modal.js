import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const schema = yup.object().shape({
    nr: yup.number().max(10000).positive().integer().required()
})

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

export default function SpringModal({ email, pass }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [inp, setInp] = React.useState('');
    const history = useHistory();
    // const handleOpen = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInp = (e) => {
        setInp(e.target.value);
    }

    const verify = () => {
        schema.isValid({
            nr: inp
        })
            .then((res) => {
                if (!res) {
                    return;
                } else {
                    axios.post('/register/verify', { inp, email, pass })
                        .then((res) => {
                            if (res.data.status === 'OK') {
                                history.push('/');
                            } else {
                                // TODO: HANDLE ERROR
                            }
                        })
                        .catch((err) => {
                            // TODO: HANDLE ERROR
                            console.log(err);
                        })
                }
            })
            .catch((er) => {
                // TODO: HANDLE ERROR
                console.log(er);
            })
    }

    return (
        <div>
            {/* <button type="button" onClick={handleOpen}>
                react-spring
            </button> */}
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="spring-modal-title">Verify email code</h2>
                        <TextField id="outlined-basic" label="Outlined" variant="outlined" onChange={handleInp} required />
                        <Button variant="contained" color="primary" onClick={verify}>
                            Verify
                        </Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}