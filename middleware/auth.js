import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        } else {
            return res.status(401).send("Token is not provided");
        }

        if (token) {
            let decodedData = jwt.verify(token, "bizzkey");
            req.userId = decodedData?.id;
        }
        next();
    } catch (error) {
        return res.status(401).json(error.message);
    }
}

export default auth