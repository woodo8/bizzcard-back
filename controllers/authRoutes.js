import bcrypt from "bcryptjs";
import validateEmail from "../utils/validateEmail.js";
import generateToken from "../utils/generateToken.js";
import { User, validateUser } from "../models/user.js";
import sgMail from "@sendgrid/mail"
import jwt from "jsonwebtoken"
import { sendVerification } from "../services/sendVerification.js";

export const signup = async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const { error } = validateUser(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { full_name, email, password } = req.body;

        // Check if the email is valid
        const emailIsValid = validateEmail(email);
        if (!emailIsValid) {
            return res.status(400).send("Email is invalid")
        }
        
        sgMail.setApiKey(process.env.SG_API_KEY);

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        user = new User({ full_name, email, password });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user to the database
        await user.save();

        // Send a verification email
        sendVerification(user)

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

export const verifyEmail = async (req, res) => {
    // #swagger.tags = ['Users']
    const { token } = req.query;

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, "bizzkey");

        // Find the user in the database 
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is verified
        user.verified = true;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body;
    // #swagger.tags = ['Users']


    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const vierifiedUser = existingUser.verified

        if (!vierifiedUser) {
            return res.status(400).json({ message: "Email is not verified" })
        }

        const token = generateToken({ email: existingUser.email, id: existingUser._id }, "1h")

        res.status(200).json({ result: existingUser, token })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

}