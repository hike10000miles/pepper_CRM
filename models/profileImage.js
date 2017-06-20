const mongoose = require('mongoose');

const profileImage = mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String
    }
});

const ProfileImage = mongoose.model('ProfileImage', profileImage);