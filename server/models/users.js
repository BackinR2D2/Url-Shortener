const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    posts: {
        type: Array,
        default: [],
    }


}, { timestamps: true })

module.exports = mongoose.model('User', UsersSchema);