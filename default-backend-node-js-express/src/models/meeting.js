'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Meeting extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Meeting.belongsTo(models.Group, { foreignKey: 'id', targetKey: 'meeting', as: 'DataMeeting' });
            Meeting.belongsTo(models.User, { foreignKey: 'idTeacher', targetKey: 'id', as: 'DataUser' });
            Meeting.belongsTo(models.History, { foreignKey: 'id', targetKey: 'meetingID', as: 'DataHistory' });
            Meeting.hasMany(models.Group, { foreignKey: 'meeting', sourceKey: 'id', as: 'Data' });
        }
    }
    Meeting.init(
        {
            day: DataTypes.STRING,
            startTime: DataTypes.STRING,
            endTime: DataTypes.STRING,
            isDone: DataTypes.BOOLEAN,
            isTeacher: DataTypes.BOOLEAN,
            isCancelled: DataTypes.BOOLEAN,
            idTeacher: DataTypes.STRING,
            count: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Meeting',
        },
    );
    return Meeting;
};
