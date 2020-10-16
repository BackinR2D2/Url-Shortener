require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const home = require('./routes/home');
const account = require('./routes/account');
const login = require('./routes/login');
const register = require('./routes/register');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(require('cors')());
app.use(require('morgan')('dev'));
app.use(cookieParser());
// connect to db
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then((_) => {
        console.log('Connected to DB.');
    })
    .catch((err) => {
        // TODO: HANDLE ERROR
        console.log(err);
    })

// routes
app.use(home);
app.use('/login', login);
app.use('/register', register);
app.use(account);

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../client')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    });
}
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})