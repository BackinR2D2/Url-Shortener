import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as yup from 'yup';

const link = window.location.hostname;

const schema = yup.object().shape({
    oldSlug: yup.string().max(256).trim().required(),
    newSlug: yup.string().max(256).trim().required(),
})

const deleteSchema = yup.object().shape({
    deleteSlug: yup.string().max(256).trim().required(),
})

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

function Account() {
    const classes = useStyles();
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

    useEffect(() => {
        let isActive = true;

        axios.get('/account')
            .then((resp) => {
                if (isActive) {
                    if (resp.data.status === 'OK') {
                        setEmail(resp.data.userInfo.email);
                        setPosts(resp.data.userInfo.posts);
                        setCreated(resp.data.userInfo.createdAt);
                        setLoading(false);
                    }
                }
            })
            .catch((err) => {
                // TODO: HANDLE ERROR
                console.log(err);
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
                // TODO: HANDLE ERR
                console.log(err);
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
                            const updatedPost = document.getElementsByClassName(id)[1];
                            updatedPost.innerText = `${link}/${newSlug}/url`;
                            updatedPost.href = `${newSlug}/url`;
                            setForm(false);
                        }
                    })
                    .catch((err) => {
                        // TODO: HANDLE ERROR
                        console.log(err);
                    })
            } else {
                return;
            }
        })
    }

    return (
        <div>
            {loading === true ?
                <p>Loading...</p>
                :
                <div>
                    <h2>Account</h2>
                    <p>Email: {email}</p>
                    <p>Created At: {created}</p>
                    <hr />
                    <br />
                    <button style={{ display: posts.length === 0 || postsLength === 0 ? 'none' : 'block' }} onClick={() => setForm(true)}>Update</button>
                    <div style={{ display: form === true ? 'block' : 'none' }} >
                        <div>
                            <TextField label="Old slug" variant="outlined" name="oldSlug" required onChange={(e) => setOldSlug(e.target.value)} />
                        </div>
                        <div>
                            <TextField label="New slug" variant="outlined" name="newSlug" required onChange={(e) => setNewSlug(e.target.value)} />
                        </div>
                        <Button variant="contained" color="primary" onClick={() => handleEdit()}>
                            Save
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => setForm(false)}>
                            Cancel
                        </Button>
                    </div>

                    <button style={{ display: posts.length === 0 || postsLength === 0 ? 'none' : 'block' }} onClick={() => setDeleteForm(true)}>Delete</button>
                    <div style={{ display: deleteForm === true ? 'block' : 'none' }}>
                        <div>
                            <TextField label="Old slug" variant="outlined" name="oldSlug" required onChange={(e) => setDeleteSlug(e.target.value)} />
                        </div>
                        <Button variant="contained" color="primary" onClick={() => handleDelete()}>
                            Delete
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => setDeleteForm(false)}>
                            Cancel
                        </Button>
                    </div>
                    {
                        posts.map(post => (
                            <div key={post.postID} className={post.postID} >
                                <p>Original Url: <a href={`${post.url}`} target="_blank" rel="noopener noreferrer" > {post.url} </a></p>
                                <div>
                                    <p>Url: <a href={`${post.slug}/url`} target="_blank" rel="noopener noreferrer" className={post.postID}> {`${link}/${post.slug}/url`} </a></p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default Account
