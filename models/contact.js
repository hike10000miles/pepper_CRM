const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = Schema({
    _userId: {
        type: String,
        required: [true, 'Contact must belong to a user.']
    },
    details: {
        firstName: {
            type: String,
            trim: true,
            minlength: [2, 'First name is too short.'],
            required: [true, 'First name is required!']
        },
        lastName: {
            type: String,
            trim: true,
            minlength: [2, 'First name is too short.'],
            required: false
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'complicated'],
            required: false
        },
        age: {
            type: String,
            trim: true,
            required: false
        },
        birthday: {
            type: Date,
            required: false
        },
        street: {
            type: String,
            trim: true,
            required: false,
            minlength: [5, 'Street address is too short.']
        },
        city: {
            type: String,
            trim: true,
            required: false,
            minlength: [4, 'City name is too short.']
        },
        province: {
            type: String,
            required: false,
            minlength: [2, 'Province name is too short.']
        },
        country: {
            type: String,
            required: false,
            minlength: [2, 'Postal code is too short.']
        },
        postalCode: {
            type: String,
            required: false,
            trim: true,
            minlength: [5, 'Postal code is too short.'],
            maxlength: [10, 'Postal code is too long'],
        },
        email: {
            required: false,
            type: String,
            trim: true,
            validate: {
                validator: function validateEmail(v) {
                    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return regex.test(v);
                },
                message: `{VALUE} is not a valid email address!`
            }
        },
        phoneNumber: {
            required: false,
            type: String,
            trim: true,
            minlength: [9, 'Phone number is too short.']
        },
        facebookProfile: {
            required: false,
            type: String,
            trim: true,
            validate: {
                validator: function validateUrl(v) {
                    let regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
                    return regex.test(v);
                },
                message: `{VALUE} is not a valid web url!`
            }
        },
        twitterProfile: {
            required: false,
            type: String,
            trim: true,
            validate: {
                validator: function validateUrl(v) {
                    let regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
                    return regex.test(v);
                },
                message: `{VALUE} is not a valid web url!`
            }
        },
    },
    foodPreferences: {
        required: false,
        type: String,
        trim: true,
        minlength: [2, 'Food preference is too short.']
    },
    work: {
        jobTitle: {
            type: String,
            required: false,
            trim: true,
            minlength: [2, 'Job title is too short.']
        },
        company: {
            type: String,
            required: false,
            trim: true,
            minlength: [2, 'Company name is too short.']
        },
        linkedIn: {
            type: String,
            required: false,
            trim: true,
            validate: {
                validator: function validateUrl(v) {
                    let regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
                    return regex.test(v);
                },
                message: `{VALUE} is not a valid web url!`
            }
        }
    },
    significantOther: {
        firstName: {
            type: String,
            required: false,
            trim: true,
            minlength: [2, 'First name is too short.']
        },
        lastName: {
            type: String,
            required: false,
            trim: true,
            minlength: [2, 'First name is too short.']
        },
        gender: {
            type: String,
            enum: ['maile', 'female', 'complicated'],
            required: false
        },
        age: {
            type: String,
            trim: true,
            required: false
        },
        birthday: {
            type: Date,
            required: false
        }
    },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;