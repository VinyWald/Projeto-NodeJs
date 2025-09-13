import jwt from "jsonwebtoken";
import User from "../models/users";
import authConf from "../../config/auth";

class SessionsControler {
    async create(req, res) {

        const { email, password } = req.body;
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: "Password not match" });
        }
        const { id, name } = user;
        return res.json({
            user:
            {
                id, name, email
            },
            token: jwt.sign({ id }, authConf.secret, {
                expiresIn: authConf.expiresIn,
            }),
        });
    }
}
export default new SessionsControler();