import sgMail from "@sendgrid/mail"
import generateToken from "../utils/generateToken.js";

export const sendVerification = async (user) => {
    const token = generateToken({ userId: user._id }, "1d")

    const msg = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Verify your email address',
        html: `
              <p>Hello ${user.full_name},</p>
              <h3>Thank you for signing up for our app. Please click on the link below to verify your email address:</h3>
              <p>this link expires in 1 day</p>
               <a href="${process.env.URL}/user/verify-email?token=${token}">Verify email address</a>
              `
    };
    return await sgMail.send(msg)
}