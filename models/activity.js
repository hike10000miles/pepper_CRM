const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    _contactId: {
        type: String,
        required: [true, 'An activity must belong to a contact.']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'An activity must has an description.'],
        minlength: [5, 'The description is too short.'],
        maxlength: [140, 'The description is too long, keep it with in 140 characters.']
    },
    date: {
        type: Date,
        required: [true, 'An activity must has a date.']
    },
    categorize: {
        type: String,
        enum: [
            'Just hangout', 'Watched a movie', 'Grabed a drink', 'Want for a walk',
            'Grabed a bite', 'Eat at a resturant', 'Went to a bar', 'Did sports together',
            'Eat at my place', 'Eat at his/her place', 'Worked out together', 'Went to a theater',
            'Went to a concert', 'Went to a festival', 'Went to a museum', 'Went to a gallery', 'No good shenanigan lol'
            ],
        required: false
    },
    comment: {
        type: String,
        required: false,
        trim: true,
        minlength: [2, 'A comment must be longer than 2 characters and shorter than 250 characters.'],
        maxlength: [250, 'A comment must be longer than 2 characters and shorter than 250 characters.']
    }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;