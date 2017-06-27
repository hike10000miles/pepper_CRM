const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config'); // get our config file
const usersRouter   = require('./controllers/user.controller'); // get our mongoose model
const authControler = require('./controllers/auth.controller');
const contactRouter = require('./controllers/contact.controller');
const journalRouter = require('./controllers/journal.controller');
const User = require('./models/user');
const Task = require('./models/task');
const Debt = require('./models/debt');
const Reminder = require('./models/reminder');
const mail = require('./controllers/mail.controller');
const mailgun = require('mailgun-js')({apiKey: config.mailgunAPIKey, domain: config.emailDomin});

const port = process.env.PORT || 8080;

const apiRouter = express.Router();

mongoose.connect(config.database);

app.set('superSecret', config.secret);
app.set('profileImagePath', config.profileImagePath);


app.use(bodyParser.urlencoded({ 
    extended: false
}));

//app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(function (req, res, next) {
    console.log(req.body);
    req.body = JSON.parse(Object.keys(req.body)[0]);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    req.tokenKey = app.get('superSecret');
    req.PROFILEIMAGE = app.get('profileImagePath');
    next();
});

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:'+ port + '/api');
});

app.post('/api/login', authControler.authUser);

app.post('/api/users', function(req, res) {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });
    //console.log(req.body);
    user.save((err, user) => {
        if (err) {
            res.status(500).json(err);
        } else if (user) {
            let email = mail.welcomeEmail(user.email, user.firstName);
            mailgun.messages().send(email, function(error, body) {
                if(error) {
                    console.log(error);
                }
                console.log(body);
            });
            res.status(200).json({
                message: 'New user has been added into the data base!',
                redirect_url: '/login',
                success: true,
                user: user
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.'
            });
        }
    });
});

app.use('/api/users', authControler.verifyToken, usersRouter);

app.use('/api/contacts', authControler.verifyToken, contactRouter);

app.get('/api/tasks', authControler.verifyToken, function (req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Task.find( {_userId: req.user._doc._id}, (err, tasks) => {
            if(err) {
                res.status(500).json({
                    message: 'Server err, try again',
                    err: err
                });
            } else if (tasks) {
                res.status(200).json(tasks);
            } else {
                res.status(403).json({
                    message: 'Something went wrong. Try again.'
                });
            }
        }).skip((page - 1) * limit).limit(limit);
    } else {
        Task.find( {_userId: req.user._doc._id}, (err, tasks) => {
            if(err) {
                res.status(500).json({
                    message: 'Server err, try again',
                    err: err
                });
            } else if (tasks) {
                res.status(200).json(tasks);
            } else {
                res.status(403).json({
                    message: 'Something went wrong. Try again.'
                });
            }
        });
    }
});

app.get('/api/debts', authControler.verifyToken, function (req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Debt.find( {_userId: req.user._doc._id}, (err, debts) => {
            if(err) {
                res.status(500).json({
                    message: 'Server err, try again',
                    err: err
                });
            } else if (debts) {
                res.status(200).json(debts);
            } else {
                res.status(403).json({
                    message: 'Something went wrong. Try again.'
                });
            }
        }).skip((page - 1) * limit).limit(limit);
    } else {
        Debt.find( {_userId: req.user._doc._id}, (err, debts) => {
            if(err) {
                res.status(500).json({
                    message: 'Server err, try again',
                    err: err
                });
            } else if (debts) {
                res.status(200).json(debts);
            } else {
                res.status(403).json({
                    message: 'Something went wrong. Try again.'
                });
            }
        });
    }
});

app.get('/api/reminders', authControler.verifyToken, function (req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Reminder.find( {_userId: req.user._doc._id}, (err, reminders) => {
            if(err) {
                res.status(500).json({
                    message: 'Server err, try again',
                    err: err
                });
            } else if (reminders) {
                res.status(200).json(reminders);
            } else {
                res.status(403).json({
                    message: 'Something went wrong. Try again.'
                });
            }
        }).skip((page - 1) * limit).limit(limit);
    } else {
        Reminder.find( {_userId: req.user._doc._id}, (err, reminders) => {
            if(err) {
                res.status(500).json({
                    message: 'Server err, try again',
                    err: err
                });
            } else if (reminders) {
                res.status(200).json(reminders);
            } else {
                res.status(403).json({
                    message: 'Something went wrong. Try again.'
                });
            }
        });
    }
});

app.use('/api/journals', authControler.verifyToken, journalRouter);

app.use('*', function (req, res) {
    res.status(404).json({
        message: 'Page Not Found!'
    });
});

app.listen(port);

console.log('Listening at http://localhost: ' + port);