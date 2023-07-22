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
            Meeting.belongsTo(models.Group, { foreignKey: 'groupID', targetKey: 'id', as: 'DataMeeting' });
        }
    }
    Meeting.init(
        {
            day: DataTypes.STRING,
            startTime: DataTypes.STRING,
            endTime: DataTypes.STRING,
            groupID: DataTypes.STRING,
            isDone: DataTypes.BOOLEAN,
            isTeacher: DataTypes.BOOLEAN,
            isCancelled: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Meeting',
        },
    );
    return Meeting;
};
