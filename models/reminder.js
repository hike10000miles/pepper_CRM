const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema({
    _contactId: {
        type: String,
        required: [true, 'A reminder must belong to a contact.']
    },
    _userId: {
        type: String,
        required: [true, 'A reminder must belong to a user.']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A reminder must have description.'],
        minlength: [2, 'This task is too short. A task needs to be between 2 and 250 characters.'],
        maxlength: [250, 'This task is too long. A task needs to be betweeen 2 and 250 characters.']
    },
    comment: {
        type: String,
        trim: true,
        required: false,
        minlength: [2, 'This comment is too short. A task needs to be between 2 and 250 characters.'],
        maxlength: [250, 'This comment is too long. A task needs to be betweeen 2 and 250 characters.']
    },
    date: {
        type: Date,
        required: [true, 'A reminder must have a date.']
    },
    frequency: {
        number: {
            type: Number,
            required: false,
        },
        unit: {
            type: String,
            enum: ['week', 'month', 'year'],
            required: false,
        }
    }
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;