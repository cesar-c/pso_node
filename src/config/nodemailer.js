const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_ORG, 
      pass: process.env.EMAIL_PASS
    }
  });
mailer.verify().then(()=>{
    console.log('Verififcación completa');
});

module.exports = mailer;

