import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as yup from 'yup';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import { useHistory } from 'react-router-dom';
import Loader from './static/Loader';
import swal from 'sweetalert';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const link = window.location.hostname;

const schema = yup.object().shape({
    oldSlug: yup.string().max(40).trim().required().matches(/^[\w-]+$/i),
    newSlug: yup.string().max(40).trim().required().matches(/^[\w-]+$/i),
})

const deleteSchema = yup.object().shape({
    deleteSlug: yup.string().max(40).trim().required().matches(/^[\w-]+$/i),
})

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
        button: {
            margin: theme.spacing(1),
        }
    },
}));

function Account() {
    const classes = useStyles();
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [posts, setPosts] = useState([]);
    const [created, setCreated] = useState('');
    const [loading, setLoading] = useState(true);
    const [newSlug, setNewSlug] = useState('');
    const [form, setForm] = useState(false);
    const [oldSlug, setOldSlug] = useState('');
    const [postsLength, setPostsLength] = useState();
    const [deleteForm, setDeleteForm] = useState(false);
    const [deleteSlug, setDeleteSlug] = useState('');
    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        let isActive = true;

        axios.get('/account')
            .then((resp) => {
                if (isActive) {
                    if (resp.data.status === 'OK') {
                        setEmail(resp.data.userInfo.email);
                        setPosts(resp.data.userInfo.posts);
                        setCreated(resp.data.userInfo.createdAt);
                        const loginbtn = document.querySelector('.loginBtn')
                        const registerbtn = document.querySelector('.registerBtn')
                        const logoutbtn = document.querySelector('.logoutBtn')
                        loginbtn.style.display = 'none';
                        registerbtn.style.display = 'none';
                        logoutbtn.style.display = 'block';
                        setLoading(false);
                    }
                }
            })
            .catch((err) => {
                swal("Oops!", "Not authorized, you have to log in again :(", "error");
                history.push('/login');
            })

        return () => {
            isActive = false;
        }
    }, [])

    const handleDelete = () => {
        deleteSchema.isValid({
            deleteSlug,
        })
            .then((resp) => {
                if (resp) {
                    axios.post('/account/delete-post', { deleteSlug })
                        .then((resp) => {
                            if (resp.data.status === 'OK') {
                                const { id, postsLen } = resp.data;
                                setPostsLength(postsLen);
                                const deletedPost = document.getElementsByClassName(id)[0];
                                deletedPost.style.display = 'none';
                                setDeleteForm(false);
                            }
                        })
                } else {
                    return;
                }
            })
            .catch((err) => {
                swal("Oops!", "Something went wrong! Try again.", "error");
            })
    }

    const handleEdit = () => {
        schema.isValid({
            oldSlug: oldSlug,
            newSlug: newSlug
        }).then((resp) => {
            if (resp) {
                axios.put('/account/update-slug', { oldSlug, newSlug })
                    .then((resp) => {
                        if (resp.data.status === 'OK') {
                            const { id } = resp.data;
                            const updatedSlug = document.getElementsByClassName(id)[1];
                            const updatedPost = document.getElementsByClassName(id)[2];
                            updatedSlug.innerText = `Slug ${newSlug}`;
                            updatedPost.innerText = `${link}/${newSlug}/url`;
                            updatedPost.href = `${newSlug}/url`;
                            setForm(false);
                        }
                    })
                    .catch((err) => {
                        if (err.response.status === 400) {
                            swal("Oops!", "Can not update slug with an already existing slug", "error");
                        } else {
                            swal("Oops!", "Something went wrong! Try again.", "error");
                        }
                    })
            } else {
                return;
            }
        })
    }

    const handleDeleteAccount = () => {
        axios.delete('/account/delete-account')
            .then((resp) => {
                if (resp.data.status === 'OK') {
                    localStorage.removeItem('user_info');
                    history.push('/register');
                }
            })
            .catch((err) => {
                swal("Oops!", "Something went wrong! Try again.", "error");
            })
    }

    const handleClose = () => {
        setForm(false);
    }

    const handleDeleteClose = () => {
        setDeleteForm(false);
    }

    const handleDeleteDialog = () => {
        setDeleteDialog(false);
    }

    return (
        <div>
            {loading === true ?
                <div className="loader container mainInp centerInp">
                    <Loader />
                </div>
                :
                <div>
                    <div className="userInfo">
                        <h2 className="accountTitle">Account</h2>
                        <p className="fz18"> Email: <span className="uinfo"> {email} </span></p>
                        <p className="fz18"> Created at: <span className="uinfo"> {created}</span> </p>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteDialog(true)}
                        >
                            Delete Account
                        </Button>
                    </div>
                    <hr />
                    <br />
                    <div className="buttonSection">
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<UpdateIcon />}
                            style={{ display: posts.length === 0 || postsLength === 0 ? 'none' : 'block' }}
                            onClick={() => setForm(true)}
                        >
                            Update Slug
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<DeleteIcon />}
                            style={{ display: posts.length === 0 || postsLength === 0 ? 'none' : 'block' }}
                            onClick={() => setDeleteForm(true)}
                        >
                            Delete Slug
                        </Button>
                    </div>
                    <div className="posts container">
                        {
                            posts.map(post => (
                                <div className={`card text-center ${post.postID}`} key={post.postID} >
                                    <div className="card-header">
                                        <h5 className={post.postID}>Slug <span className="uinfo">{post.slug}</span></h5>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Initial Url: <a href={`${post.url}`} target="_blank" rel="noopener noreferrer" > {post.url} </a>
                                        </h5>
                                        <h5>
                                            New Url: <a href={`${post.slug}/url`} target="_blank" rel="noopener noreferrer" className={post.postID}> {`${link}/${post.slug}/url`} </a>
                                        </h5>
                                    </div>
                                    <div className="card-footer text-muted">
                                        Created at: {post.date}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {
                        form === true ?
                            <div>
                                <Dialog open={form} onClose={handleClose} aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">
                                        <p className="dialogTitle">Update Slug</p>
                                    </DialogTitle>
                                    <DialogContent>
                                        <div>
                                            <TextField label="Slug" variant="outlined" name="oldSlug" required onChange={(e) => setOldSlug(e.target.value)} />
                                        </div>
                                        <div>
                                            <TextField label="New slug" variant="outlined" name="newSlug" required onChange={(e) => setNewSlug(e.target.value)} />
                                        </div>
                                        <div className="buttonSection">
                                            <Button variant="contained" color="primary" onClick={() => handleEdit()}>
                                                Save
                                        </Button>
                                            <Button variant="contained" color="secondary" onClick={() => setForm(false)}>
                                                Cancel
                                        </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            :
                            <></>
                    }
                    {
                        deleteForm === true ?
                            <div>
                                <Dialog open={deleteForm} onClose={handleDeleteClose} aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">
                                        <p className="dialogTitle">Delete Slug</p>
                                    </DialogTitle>
                                    <DialogContent>
                                        <div>
                                            <TextField label="Slug" variant="outlined" name="oldSlug" required onChange={(e) => setDeleteSlug(e.target.value)} />
                                        </div>
                                        <div className="buttonSection">
                                            <Button variant="contained" color="primary" onClick={() => handleDelete()}>
                                                Delete
                                        </Button>
                                            <Button variant="contained" color="secondary" onClick={() => setDeleteForm(false)}>
                                                Cancel
                                        </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            :
                            <></>
                    }
                    {
                        deleteDialog === true ?
                            <div>
                                <Dialog open={deleteDialog} onClose={handleDeleteDialog} aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">
                                        <p className="dialogTitle">Delete Account</p>
                                    </DialogTitle>
                                    <DialogContent>
                                        <p>Confirming further will permanently delete your account.</p>
                                        <div className="buttonSection">
                                            <Button variant="contained" color="primary" onClick={() => handleDeleteAccount()}>
                                                Delete
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={() => setDeleteDialog(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            :
                            <></>
                    }
                </div>
            }
        </div>
    )
}

export default Account
