const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _contactId: {
        type: String,
        required: [true, 'A task must belong to a contact.']
    },
    _userId: {
        type: String,
        required: [true, 'A task must belong to a user.']
    },
    contactName: {
        type: String,
        trim: true,
        require: [true, 'A task must have a contact name']
    },
    task: {
        type: String,
        trim: true,
        required: [true, 'A task must have content.'],
        minlength: [2, 'This task is too short. A task needs to be between 2 and 250 characters.'],
        maxlength: [250, 'This task is too long. A task needs to be betweeen 2 and 250 characters.']
    },
    comment: {
        type: String,
        trim: true,
        required: false,
        maxlength: [250, 'This comment is too long. A task needs to be betweeen 2 and 250 characters.']
    },
    done: {
        type: Boolean,
        required: [true, 'A task must indicated if it is done.']
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;