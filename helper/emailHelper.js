import nodeMailer from 'nodemailer';

export const sendEmail = async (options) =>{
   const transporter = nodeMailer.createTransport({
     service:process.env.SMTP_Service,
     auth:{
        user:process.env.SMTP_Mail,
        pass:process.env.SMTP_Pass,

    },
    tls: {
        rejectUnauthorized: false
      }
    
   })
   const mailOptions = {
        from: process.env.SMTP_Mail,
        to:options.email,
        subject:options.subject,
        text:options.message,

    }
    await transporter.sendMail(mailOptions);
}