import Sequelize, { Model } from "sequelize";

class Contacts extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            status: Sequelize.ENUM("ACTIVER", "ARCHIVED"),
        },
            { 
                sequelize,
            }
        );
    }
    static associate(models) {
        this.belongsTo(models.Customer, { foreignKey: "customer_id" });
    }
}
export default Contacts;