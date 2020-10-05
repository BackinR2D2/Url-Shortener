require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const home = require('./routes/home');
const mongoose = require('mongoose');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')());
app.use(require('morgan')('dev'));

// connect to db
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((_) => {
        console.log('Connected to DB.');
    })
    .catch((err) => {
        // TODO: HANDLE ERROR
        console.log(err);
    })

// routes
app.use(home);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})