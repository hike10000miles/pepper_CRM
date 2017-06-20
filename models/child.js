const mongoose = require('mongoose');

const childSchema = mongoose.Schema({
    _contactId: {
        type: String,
        required: [true, 'Dose a child has a parent?']
    },
    fistName: {
        type: String,
        required: [true, 'First name is required!'],
        minlength: [2, 'First name is too short.']
    },
    lastName: {
        type: String,
        required: false,
        minlength: [2, 'Last name is too short']
    },
    age: {
        type: String,
        required: false
    },
    birthday: {
        type: Date,
        required: false
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'complicated'],
        required: false
    }
});

const Child = mongoose.model('Child', childSchema);

module.exports = Child;