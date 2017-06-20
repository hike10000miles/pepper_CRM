const mongoose = require('mongoose');

const debtSchema = mongoose.Schema({
    _contactId: {
        type: String,
        required: [true, 'A debt must belong to a contact.']
    },
    _userId: {
        type: String,
        required: [true, 'A debt must belong to a user.']
    },
    contactName: {
        type: String,
        required: [true, 'A debt must have a contact name.']
    },
    owner: {
        type: String,
        enum: ['own', 'owned'],
        required: [true, 'A debt must be owned by someone']
    },
    amount: {
        type: String,
        required: [true, 'A debt must be bigger then 0.']
    },
    paid: {
        type: Boolean,
        required: false
    }
});

const Debt = mongoose.model('Debt', debtSchema);

module.exports = Debt;