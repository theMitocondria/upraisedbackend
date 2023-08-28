import nodemailer from "nodemailer";

const sendEmail = async (
  receiverEmail,
  heading,
  message,
  name = "USER"
) => {
  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:587,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure:false,
    requireTLS: false,
    tls: {rejectUnauthorized: false},
    debug:true
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender address
    to: receiverEmail, // List of recipients
    subject: heading, // Subject line
    html: ` <div>
    ${message}
        </div>`,
  };

  transport.sendMail(mailOptions);

};


export default sendEmail;