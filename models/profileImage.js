const mongoose = require('mongoose');

const profileImage = mongoose.Schema({
    img: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    _contactId: {
        type: String,
        required: true
    } 
});

const ProfileImage = mongoose.model('ProfileImage', profileImage);

module.exports = ProfileImage;