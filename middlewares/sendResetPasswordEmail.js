import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (
    name,
  receiverEmail,
  link,
) => {
  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender address
    to: receiverEmail, // List of recipients
    subject: "Reset Password", // Subject line
    html: ` <div
    style="border:0.5px solid ;  border-radius: 12px; 
    background-color: rgb(0, 0, 0); ; align-items:center; padding: 10px;">

    <img style="height:60px; "
        src="https://res.cloudinary.com/dycitvrpg/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1681382796/logo_xx6npu.jpg"
        alt="Crossfit">
    <hr>
    <br>
    <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color:rgb(235, 235, 235)">Dear ${name}</p>
    <p
        style="font-size: 13px; font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235); margin-bottom: 25px; ">
        We have received your request to reset your password for your CrossFit account. Please use the following
        link to create a new password:</p>

    <a href=${link}
        style="background-color:white; padding:6px 10px ; margin: 10px;  border-radius: 8px; font-family: Arial, Helvetica, sans-serif; color:rgb(0, 0, 0)">Reset
        Password</a>

    <p
        style="  margin-top: 25px;font-size: 13px; font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235)">


        Please note that this link is valid for a limited time only. If you do not reset your password within the
        given time, you will need to request a new reset link.
        If you did not request a password reset, please contact our support team immediately at [insert support email or phone
number] to report this issue.
Thank you for using our app and for helping us maintain a secure and trustworthy platform for all our users.

    </p>

  
    <p style=" font-size: 13px;font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235)">Best regards,
    </p>
    <p style="font-size: 13px; font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235)">The CrossFit
        Team</p>

</div>`  };

  transport.sendMail(mailOptions);
};