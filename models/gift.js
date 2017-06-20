const mongoose = require('mongoose');

const giftSchema = mongoose.Schema({
    _contactId: {
        type: String,
        required: [true, 'A debt must belong to a contact.']
    },
    status: {
        type: String,
        enum: ['Gift idea', 'gift already offered'],
        required: [true, 'A gift must has status, is it an idea or already offered.']
    },
    description: {
        type: String,
        trim: true,
        require: [true, 'A gift must has description.'],
        minlength: [2, 'Description must be longer than 2 characters and shorter than 250 characters.'],
        maxlength: [140, 'Description must be longer than 2 characters and shorter than 250 characters.']
    },
    link: {
        type: String,
        required: false,
        validate: {
            validator: function validateUrl(v) {
                let regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
                return regex.test(v);
            },
            message: `{VALUE} is not a valid web url!`
        }
    },
    value: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        trim: true,
        require: false,
        minlength: [2, 'Comment must be longer than 2 characters and shorter than 250 characters.'],
        maxlength: [250, 'Comment must be longer than 2 characters and shorter than 250 characters.']
    },
    forFamily: {
        type: Boolean,
        required: false
    },
    familyReciver: {
        type: String,
        trim: true,
        required: false,
        minlength: [2, 'Too short.'],
    }
});

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift;