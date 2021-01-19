const sgMail = require('@sendgrid/mail')

//const sendgridAPIKey = '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'

//sgMail.setApiKey(sendgridAPIKey)

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to: 'pratush.bh@gmail.com',
//     from: 'pratushbhandari4@gmail.com',
//     subject: 'This is my first creation',
//     text: 'I hope this one actually get to you'
// })


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pratushbhandari4@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcomoe to the app, ${name}. Let me know how you get along with the app.`  //when using backticks we can inject variables right inside 
       // html: //to make fancy email with images or anything
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pratushbhandari4@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye, ${name}. I hope to see back sometime soon.`
    })
}

module.exports = {   //An object as we are exporting multiple functions
    sendWelcomeEmail,
    sendCancelationEmail
}