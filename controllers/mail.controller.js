function welcomeEmail(reciever, username) {
    return {
        from: 'Pepper Potts <pepper@pepper.org>',
        to: reciever,
        subject: 'Welcome to Pepper',
        html: `<h1>Wecome</h1><p>${username}</p><p>I am Pepper, your personal relationship manager.</p>`
    }
}


module.exports.welcomeEmail = welcomeEmail;