const mongoose = require('mongoose');
const bcrpt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate: {
            validator: function validateEmail(v) {
                let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return regex.test(v);
            },
            message: `{VALUE} is not a valid email address!`
        }
    },
    firstName: {
        type: String,
        trim: true,
        minlength: [2, 'First name is too short.'],
        required: [true, 'First name is required!']
    },
    lastName: {
        type: String,
        trim: true,
        minlength: [2, "Last name is too short"],
        required: [true, 'Last name is required!']
    },
    password: {
        type: String,
        trim: true,
        minlength: [6, 'Password must be longer than 6 letter.'],
        required: [true, 'Password is required!']
    }
});

//Execute before each user.save() call
userSchema.pre('save', function(callback) {
    let user = this;

    //Break out if the password hasn't changed
    if (!user.isModified('password')) {
        return callback();
    }

    //Password changed so we need to hash it
    bcrpt.genSalt(5, (err, salt) => {
        if (err) {
            return callback(err);
        }

        bcrpt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return callback(err);
            }
            user.password = hash;
            callback();
        });
    });
});

userSchema.pre('findOneAndUpdate', function(callback) {
    let user = this;

    //Break out if the password hasn't changed
    /*if (!user.isModified('password')) {
        return callback();
    }
    */

    //Password changed so we need to hash it
    bcrpt.genSalt(5, (err, salt) => {
        if (err) {
            return callback(err);
        }

        bcrpt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return callback(err);
            }
            user.password = hash;
            callback();
        });
    });
});

userSchema.methods.verifypassword =  function(password, cb) {
    bcrpt.compare(password, this.password, function(err, isMatch) {
        if(err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;