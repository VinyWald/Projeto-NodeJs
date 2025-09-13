import nodemailer from "nodemailer";
import mailConf from "../config/mail";

class Mail {
    constructor() {
        const { host, port, secure, auth } = mailConf;
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null,
        });
    }
    send(message) { 
        return this.transporter.sendMail({
            ...mailConf.default,
            ...message,
        });
    }
}
export default new Mail();