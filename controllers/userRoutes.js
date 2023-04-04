import bcrypt from "bcryptjs";
import validateEmail from "../utils/validateEmail.js";
import generateToken from "../utils/generateToken.js";
import { User, validateUser } from "../models/user.js";
import sgMail from "@sendgrid/mail"
import jwt from "jsonwebtoken"
import { sendVerification } from "../services/sendVerification.js";
import mongoose from "mongoose";

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

        const userInfos = req.body
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No user with that id")

        const updatedUser = await User.findByIdAndUpdate(id, { ...userInfos, id }, { new: true })

        const resUserInfos = {
            id: updatedUser._id,
            full_name: updatedUser.full_name,
            email: updatedUser.email,
            subscription: updatedUser.subscription,
            verified: updatedUser.verified,
            mobile: updatedUser.mobile,
            profile_img: updatedUser.profile_img
        }

        res.status(200).json(resUserInfos)
    } catch (err) {
        res.status(401).send(err);
    }
}