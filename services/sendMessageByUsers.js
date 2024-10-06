import sgMail from "@sendgrid/mail"

export const sendMessageByUsers = async (req, res) => {
    // {
    //     from,
    //     fromName,
    //     fromPhone,
    //     text,
    //     to,
    //     toName  
    // }
    try {

        const msg = {
            to: req.to,
            from: process.env.EMAIL,
            subject: `New Email from from ${req.from}`,
            html: `
                  <p>Привет ${req.toName},</p>
                  <h3>You have a new message from ${req.fromName} with email ${req.from}</h3>
                  <p><b> ${req.fromName}</b>: 
                    ${req.text}</p>
                  `
        };
        return await sgMail.send(msg)
    } catch (error) {
        console.log(error)
    }
}
