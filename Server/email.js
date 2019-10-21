require('dotenv').config({
    path: 'Env_Variables.env'
});
const nodemailer = require('nodemailer');


const createAccountMail = (name,emaiTo) => {
    // send mail with defined transport object
    let mailInfo = {
        from: process.env.EMAIL, // sender address
        to: emaiTo, // list of receivers,
        cc : process.env.EMAIL,
        subject: 'New Account Created in R-Commerce!', // Subject line
        text: `Hi ${name} Welcome to R-Commerce!`, // plain text body
        html: `<span>Hi ${name},</span></br><b><h2>Welcome to R-Commerce!</b></h2>` // html body
    };
    sendMail(mailInfo);

}

const sendMail = (mailInfo) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user: process.env.EMAIL, // auth user
            pass: process.env.EMAIL_PASSWORD // auth user password
        }
    });

    transporter.sendMail(mailInfo, function (err, info) {
        if(err)
          throw new Error(err)
        else
          console.log('info in nodemailer>>>>>>>>>>>>',info);
    });
}

export default createAccountMail