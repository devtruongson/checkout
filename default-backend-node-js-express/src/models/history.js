'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class History extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            History.hasMany(models.Meeting, { foreignKey: 'id', sourceKey: 'meetingID', as: 'DataHistory' });
            History.belongsTo(models.Group, { foreignKey: 'groupID', targetKey: 'id', as: 'DataHistoryData' });
        }
    }
    History.init(
        {
            groupID: DataTypes.STRING,
            meetingID: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'History',
        },
    );
    return History;
};
