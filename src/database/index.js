import Sequelize from "sequelize";
import config from "../config/database";
import Customer from "../app/models/Customer";
import Contact from "../app/models/Contacts";
import Users from "../app/models/users";
import File from "../app/models/File";

const models = [Customer, Contact, Users, File];

class Database {
    constructor() {

        this.connection = new Sequelize(config);

        this.init();

        this.associate();
    }
    init() {

        models.forEach(model => {

            model.init(this.connection);
        });

    }
    associate() {
        models.forEach(model => {
            if (model.associate) {
                model.associate(this.connection.models);
            }
        });
    }
}
export default new Database();