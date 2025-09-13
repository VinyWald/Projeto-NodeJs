import jwt from "jsonwebtoken";
import { promisify } from "util";
import authConf from "../../config/auth";

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Token is not provided." });
    }
    const [, token] = authHeader.split(" ");
    try {
        const decoded = await promisify(jwt.verify)(token, authConf.secret);
        console.log({ decoded });
        return next();
    } catch (error) {
        return next();
    }


};
