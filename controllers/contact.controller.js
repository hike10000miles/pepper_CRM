const express = require('express');
const Contact = require('../models/contact');
const Task = require('../models/task');
const Debt = require('../models/debt');
const Gift = require('../models/gift');
const Note = require('../models/note');
const Child = require('../models/child');
const Reminder = require('../models/reminder');
const taskRoute = require('./task.controller');
const activityRouter = require('./activity.controller');
const childRouter = require('./child.controller');
const debtRouter = require('./debt.controller');
const giftRouter = require('./gift.controller');
const noteRouter = require('./note.controller');
const reminderRouter = require('./reminder.controller');
const fs = require('fs');
const ProfileImage = require('../models/profileImage');
const multer      = require('multer');
const path = require('path');

const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ 
    dest: './uploads/', 
    limits: { fieldSize: 2000 }, 
    fileFilter: imageFilter
}).single('image');

const contactRoute = express.Router();

contactRoute.param('contactId', function(req, res, next) {
    Contact.findById(req.params.contactId, (err, contact) => {
        if(err) {
            res.status(500).json({
                message: "This is not the contact your are looking for.",
                err: err
            });
        } else {
            if (contact) {
                req.contact = contact;
            } else {
                res.status(404).json({
                    message: "This is not the user's profile you are looking for"
                });
            }
        }
        next();
    })
});
contactRoute.get('/', function(req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Contact.find({_userId: req.user._doc._id}, (err, contacts) => {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again later'
                });
            } else if (contacts) {
                res.status(200).json(contacts);
            } else {
                res.status(403).json({
                    message: "Something went wrong. Try again."
                });
            }
        }).skip((page - 1) * limit).limit(limit);
    } else {
        Contact.find({_userId: req.user._doc._id}, (err, contacts) => {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again later'
                });
            } else if (contacts) {
                res.status(200).json(contacts);
            } else {
                res.status(403).json({
                    message: "Something went wrong. Try again."
                });
            }
        });
    }
});

contactRoute.post('/', function(req, res) {
    let contact = new Contact({
        _userId: req.user._doc._id,
        details: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gender: req.body.gender,
        }
    });

    contact.save((err, contact) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later.'
            });
        } else if (contact) {
            res.status(200).json({
                message: 'New contact has been added into the data base!',
                contact: contact
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.'
            });
        }
    });
});

contactRoute.get('/:contactId', function(req, res) {
    if(req.contact) {
        res.status(200).json(req.contact);
    } else {
        res.status(404).json({
            message: 'This is not the contact you are looking for'
        })
    }
});

contactRoute.patch('/:contactId', function(req, res) {
    let date;
    if(req.body.birthday) {
        date = new Date(req.body.birthday);
    }
    Contact.findOneAndUpdate({
        _id: req.contact._id
    },{
        $set: {
            details: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                age: req.body.age,
                birthday: date,
                street: req.body.street,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                postalCode: req.body.postalCode,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                facebookProfile: req.body.facebookProfile,
                twitterProfile: req.body.twitterProfile,
            }
        }
    },{
        runValidators: true,
        new: true
    }, function (err, contact) {
        if (err) {
            res.status(500).json({
                err: err,
                message: 'Server error, try again.'
            });
        } else if(contact) {
            res.status(200).json({
                message: req.contact.details.firstName + '\'s details Update successfule.',
                contact: contact,
                redirect_url: '/dashboard',
                success: true
            });
        } else {
            res.status(400).json({
                message: 'Bad request'
            });
        }
    });
});

contactRoute.patch('/:contactId/food', function(req, res) {
    Contact.update({
        _id: req.contact._id
    },{
        foodPreferences: req.body.foodPreferences
    },{
        runValidators: true,
    }, function (err, raw) {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else if(raw.n && raw.ok) {
            res.status(200).json({
                message: req.contact.details.firstName + '\'s food perference details Update successfule.',
                redirect_url: '/dashboard',
                success: true
            });
        } else {
            res.status(400).json({
                message: 'Bad request'
            });
        }
    });
});

contactRoute.patch('/:contactId/work', function(req, res) {
    Contact.update({
        _id: req.contact._id
    },{
        work: {
            jobTitle: req.body.jobTitle,
            company: req.body.company,
            linkedIn: req.body.linkedIn
        }
    },{
        runValidators: true,
    }, function (err, raw) {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else if(raw.n && raw.ok) {
            res.status(200).json({
                message: req.contact.details.firstName + '\'s work details Update successfule.',
                redirect_url: '/dashboard',
                success: true
            });
        } else {
            res.status(400).json({
                message: 'Bad request'
            });
        }
    });
});

contactRoute.patch('/:contactId/significantOther', function(req, res) {
    let date;
    if(req.body.birthday) {
        date = new Date(req.body.birthday);
    }
    Contact.findOneAndUpdate({
        _id: req.contact._id
    },{
        significantOther: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gender: req.body.gender,
            age: req.body.age,
            birthday:date
        }
    },{
        runValidators: true,
    }, function (err, contact) {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else if(contact) {
            res.status(200).json({
                message: req.contact.details.firstName + '\'s significant other\'s details Update successfule.',
                redirect_url: '/dashboard',
                success: true
            });
        } else {
            res.status(400).json({
                message: 'Bad request'
            });
        }
    });
});

contactRoute.get('/:contactId/photo', function(req, res) {
    ProfileImage.findOne({_contactId: req.contact._id}, (err, image) => {
        if (err) {
            res.status(500).json({
                err: err
            });
        } else if (image) {
            fs.writeFile(path.join(req.PROFILEIMAGE, image._contactId), image.img,(err) => {
                if (err) {
                    res.status(500).json({
                        err: err
                    });
                } else {
                    let stream = fs.createReadStream(path.join(req.PROFILEIMAGE, image._contactId)).pipe(res);
                    stream.on('finish', function() {
                        console.log('Image dowloaded');
                        fs.unlink(path.join(req.PROFILEIMAGE, image._contactId), (err) => {
                            if(err) {
                                console.log(err);
                            }
                        });
                    })
                }    
            });
        }
    });
});

contactRoute.post('/:contactId/photo', function (req, res){
    ProfileImage.remove({_contactId: req.contact._id}, (err) => {
        if (err) {
            res.status(500).json({
                err: err
            });
        } else {
            upload(req, res, function(err) {
                if(err) {
                    res.status(400).json({
                        err: 'Please only upload image file like jpg and png. Also file has to be smaller than 2MB'
                    })
                } else {
                    let newImage = new ProfileImage({
                        img: fs.readFileSync(req.file.path),
                        contentType: req.file.mimetype,
                        _contactId: req.contact._id
                    });
                    newImage.save((err, image) => {
                        fs.unlink(req.file.path, function(err) {
                            if(err) {
                                console.log(err);
                                res.status(400).json({
                                    err: err
                                });
                            } else {
                                console.log("Uploaded file deleted.");
                            }
                        });
                        if (err) {
                            res.status(500).json({
                                message: 'Server error, try again later.',
                                err: err
                            });
                        } else if(image){
                            res.status(200).json({
                                message: 'New profile image has been added into the data base!',
                                result: req.file
                            });
                        } else {
                            res.status(400).json({
                                message: 'Something went wrong. Try again.'
                            });
                        }
                    });
                }
            });
        }
    });
});

contactRoute.delete('/:contactId', function(req, res) {
    Contact.remove({_userId: req.user._doc._id, _id: req.params.contactId}, function (err) {
        if(err) {
            res.status(500).send({
                message: 'Server error, try again later.'
            });
        }
        Task.remove({_userId: req.user._doc._id, _contactId: req.params.contactId},  function (err) {
            if(err) {
                res.status(500).send({
                    message: 'Server error, try again later.'
                });
            }
            Debt.remove({_userId: req.user._doc._id, _contactId: req.params.contactId},  function (err) {
                if(err) {
                    res.status(500).send({
                        message: 'Server error, try again later.'
                    });
                }
                Child.remove({_contactId: req.params.contactId},  function (err) {
                    if(err) {
                        res.status(500).send({
                            message: 'Server error, try again later.'
                        });
                    }
                    Gift.remove({_contactId: req.params.contactId},  function (err) {
                        if(err) {
                            res.status(500).send({
                                message: 'Server error, try again later.'
                            });
                        }
                        Note.remove({_contactId: req.params.contactId},  function (err) {
                            if(err) {
                                res.status(500).send({
                                    message: 'Server error, try again later.'
                                });
                            }
                            Reminder.remove({_userId: req.user._doc._id, _contactId: req.params.contactId},  function (err) {
                                if(err) {
                                    res.status(500).send({
                                        message: 'Server error, try again later.'
                                    });
                                }
                                res.status(200).json({
                                    message: "Contact's profile has been deleted."
                                })
                            });
                        });
                    });
                });
            });
        });
    });
});

contactRoute.use('/:contactId/tasks', taskRoute);
contactRoute.use('/:contactId/activities', activityRouter);
contactRoute.use('/:contactId/children', childRouter);
contactRoute.use('/:contactId/debts', debtRouter);
contactRoute.use('/:contactId/gifts', giftRouter);
contactRoute.use('/:contactId/notes', noteRouter);
contactRoute.use('/:contactId/reminders', reminderRouter);

module.exports = contactRoute;