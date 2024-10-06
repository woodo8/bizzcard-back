import sgMail from "@sendgrid/mail"
import { sendMessageByUsers } from "../services/sendMessageByUsers.js";
import validateEmail from "../utils/validateEmail.js";
export const sendEmail = async (req, res) => {
    // #swagger.tags = ['SendEmail']
    // {
    //     "from": "dovudbekyusufzoda@gmail.com",
    //     "fromName": "Dovudbek",
    //     "fromPhone": "+89834934",
    //     "text": "sup baby, you okay? call me asap",
    //     "to": "yusufzodadovud333@gmail.com",
    //     "toName": "woodo"
    // }


    try {
        console.log(req)
        const { from, to } = req.body;

        // // Check if the email is valid
        const fromEmailIsValid = validateEmail(from);
        const toEmailIsValid = validateEmail(to);
        if (!fromEmailIsValid || !toEmailIsValid) {
            return res.status(400).send("One of the Emails is invalid")
        }

        sgMail.setApiKey(process.env.SG_API_KEY);

        // // Check if user already exists
        // let user = await User.findOne({ email });

        // if (!user) {
        //     return res.status(400).send('User does not exist');
        // }

        // Send a verification email
        await sendMessageByUsers(req.body, res);

        return res.status(200).json("Message sent succesfully");
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
