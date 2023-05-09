import bcrypt from "bcryptjs";
import validateEmail from "../utils/validateEmail.js";
import generateToken from "../utils/generateToken.js";
import { User, validateUser } from "../models/userSchema.js";
import sgMail from "@sendgrid/mail"
import jwt from "jsonwebtoken"
import { forgotPasswordVerification, sendVerification } from "../services/sendVerification.js";

export const signup = async (req, res) => {
    // #swagger.tags = ['Auth']
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
            if (user.verified !== false) {
                return res.status(400).send('User already exists');
            }
        }

        // Create a new user
        user = new User({ full_name, email, password });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user to the database

        // Send a verification email
        sendVerification(user, res);
        await user.save();
        return res.status(200).json('User registered successfully');
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


export const signin = async (req, res) => {
    const { email, password } = req.body;
    // #swagger.tags = ['Auth']


    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json("User does not exist")
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json("Invalid credentials")
        }

        const vierifiedUser = existingUser.verified

        if (!vierifiedUser) {
            return res.status(400).json("Email is not verified")
        }

        const token = generateToken({ email: existingUser.email, userId: existingUser._id }, "1h")

        const userInfos = {
            id: existingUser._id,
            full_name: existingUser.full_name,
            email: existingUser.email,
            subscription: existingUser.subscription,
            verified: existingUser.verified,
            mobile: existingUser.mobile,
            profile_img: existingUser.profile_img
        }
        return res.status(200).json({ result: userInfos, token })
    } catch (err) {
        return res.status(500).json("Internal server error!")
    }

}

export const forgotPassword = async (req, res) => {
    // #swagger.tags = ['Auth']
    try {

        const { email } = req.body;

        // Check if the email is valid
        const emailIsValid = validateEmail(email);
        if (!emailIsValid) {
            return res.status(400).send("Email is invalid")
        }

        sgMail.setApiKey(process.env.SG_API_KEY);

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User does not exist');
        }

        // Send a verification email
        await forgotPasswordVerification(user, res);

        return res.status(200).json('Email to Reset password was sent to your email address');
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const resetPassword = async (req, res) => {
    // #swagger.tags = ['Auth']

    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(401).send("Passwords do not match")
    }
    let token
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else {
        return res.status(401).send("Token is not provided");
    }
    let decodedData
    if (token) {
        decodedData = jwt.verify(token, "bizzkey");
    }

    const id = decodedData.userId

    const user = await User.findById(id);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return res.status(200).json("Password updated successfully");
}

export const verifyEmail = async (req, res) => {
    // #swagger.tags = ['Auth']
    const { token } = req.query;

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, "bizzkey");

        // Find the user in the database 
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Check if the user is verified
        user.verified = true;
        await user.save();
        return res.redirect(`${process.env.FRONT}/login_success`);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}