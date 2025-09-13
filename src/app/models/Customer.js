import Sequelize, { Model } from "sequelize";

class Customer extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            status: Sequelize.ENUM("ACTIVER", "ARCHIVED"),
        },
            {
                sequelize,
              
            },
           
        ); 
    }
    static associate(models) {
        this.hasMany(models.Contacts);
    }
}
export default Customer;