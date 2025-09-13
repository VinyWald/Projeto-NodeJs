import Mail from "../../lib/Mail";

class NewEmailJob {
    get key() {
        return "NewEmail";
    }
    async handle({ data }) {
        
        const { email, name } = data;

        Mail.send({
            to: email,
            subject: "Bem_vindo(a)",
            text: `Olá ${name}, bem vindo ao nosso sistema`,

        });
    }
}
export default new NewEmailJob();