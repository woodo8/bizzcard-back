import bcrypt from "bcryptjs";
import validateEmail from "../utils/validateEmail.js";
import generateToken from "../utils/generateToken.js";
import { User, validateUser } from "../models/user.js";
import sgMail from "@sendgrid/mail"
import jwt from "jsonwebtoken"
import { sendVerification } from "../services/sendVerification.js";
import mongoose from "mongoose";

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
            return res.status(400).send('User already exists');
        }

        // Create a new user
        user = new User({ full_name, email, password });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user to the database

        // Send a verification email
        const errorSendingEmail = sendVerification(user);

        // if (errorSendingEmail) {
        //     return res.status(500).send("Internal server error!");
        // }
        await user.save();
        res.status(200).json('User registered successfully');
    } catch (err) {
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
            return res.status(404).send('User not found');
        }

        // Check if the user is verified
        user.verified = true;
        await user.save();
        res.redirect(`${process.env.FRONT}/login_success`);
    } catch (err) {
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
        res.status(200).json({ result: userInfos, token })
    } catch (err) {
        res.status(500).json({ message: "Internal server error!" })
    }

}

export const userInfos = async (req, res) => {
    // #swagger.tags = ['Users']
    // const { token: token } = req.params;

    try {
        const { id: id } = req.params;

        const existingUser = await User.findById(id);

        if (!existingUser) {
            return res.status(404).send('User not found');
        }

        const userInfos = {
            id: existingUser._id,
            full_name: existingUser.full_name,
            email: existingUser.email,
            subscription: existingUser.subscription,
            verified: existingUser.verified,
            mobile: existingUser.mobile,
            profile_img: existingUser.profile_img
        }
        // Check if the user is verified
        return res.status(200).json(userInfos);
    } catch (err) {
        res.status(401).send(err);
    }
}

export const editProfile = async (req, res) => {
    // #swagger.tags = ['Users']
    // const { token: token } = req.params;

    try {
        const { id: id } = req.params;
        console.log(mongoose.Types.ObjectId.isValid(id))

        const userInfos = req.body
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No user with that id")

        const updatedUser = await User.findByIdAndUpdate(id, { ...userInfos, id }, { new: true })

        res.status(200).json(updatedUser)

    } catch (err) {
        res.status(401).send(err);
    }
}

