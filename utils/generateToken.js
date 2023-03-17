import jwt from "jsonwebtoken";

const generateToken = (payload, duration) => {
    return jwt.sign(payload, "bizzkey", { expiresIn: duration });
}

export default generateToken;