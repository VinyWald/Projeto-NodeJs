import Sequelize, { Model } from "sequelize";

class File extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            path: Sequelize.STRING,
             
        },
            {
                sequelize,
            }
        );
    }
    static associate(models) {
        this.hasMany(models.Users);
    }
}
export default File;