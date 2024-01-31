
import { User, validateUser } from "../models/userSchema.js";
import mongoose from "mongoose";

export const userInfos = async (req, res) => {
    // #swagger.tags = ['Users']

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
        return res.status(401).send(err);
    }
}

export const editProfile = async (req, res) => {
    // #swagger.tags = ['Users']

    try {
        const { id: id } = req.params;

        const userInfos = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No user with that id");

        for (var key in userInfos) {
            //@ts-ignore
            if (!userInfos[key] || userInfos[key] == "null") {
                delete userInfos[key];
            }
        }

        if (req.file) {
            userInfos.profile_img = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(id, { ...userInfos, id }, { new: true });
        const resUserInfos = {
            id: updatedUser._id,
            full_name: updatedUser.full_name,
            email: updatedUser.email,
            subscription: updatedUser.subscription,
            verified: updatedUser.verified,
            mobile: updatedUser.mobile,
            profile_img: updatedUser.profile_img
        }

        return res.status(200).json(resUserInfos);
    } catch (err) {
        console.log(err)
        return res.status(400).json(err);
    }
}