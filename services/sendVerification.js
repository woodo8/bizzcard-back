import sgMail from "@sendgrid/mail"
import generateToken from "../utils/generateToken.js";

export const sendVerification = async (user, res) => {
    try {
        const token = generateToken({ userId: user._id }, "1d")

        const msg = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Подтверждение адрес электронной почты.',
            html: `
                  <p>Привет ${user.full_name},</p>
                  <h3>Благодарим вас за регистрацию в нашем приложении. Пожалуйста, нажмите на ссылку ниже, чтобы подтвердить свой адрес электронной почты:</h3>
                  <p>эта ссылка истекает через 1 день</p>
                   <a href="${process.env.URL}/user/verify-email?token=${token}">Подтвердить адрес электронной почты</a>
                  `
        };

        return await sgMail.send(msg)

    } catch (error) {
        return res.status(500).send("Internal server error")
    }
}
export const forgotPasswordVerification = async (user, res) => {
    try {
        const token = generateToken({ userId: user._id }, "1d")

        const msg = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Ссылка для сброса пароля от Bizzcard.',
            html: `
                  <p>Привет ${user.full_name},</p>
                  <h3>Забыли пароль?</h3>
                  <h4>Это нормально, такое бывает. Нажмите на кнопку ниже, чтобы сбросить пароль.</h4>
                  <h5>Предупреждение!!! Если вы не предприняли никаких действий на нашем веб-сайте по сбросу пароля, просто проигнорируйте это письмо.</h5>
                  <p>эта ссылка истекает через 1 день</p>
                   <a href="${process.env.FRONT}/new_password/${token}">Подтвердить адрес электронной почты</a>
                  `
        };
        return await sgMail.send(msg)
    } catch (error) {
        return res.status(500).send("Internal server error")
    }
}