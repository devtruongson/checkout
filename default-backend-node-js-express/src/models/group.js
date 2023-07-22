'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Group extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Group.belongsTo(models.Class, { foreignKey: 'id', targetKey: 'group', as: 'DataGroup' });
            Group.hasMany(models.Meeting, { foreignKey: 'groupID', sourceKey: 'id', as: 'DataMeeting' });
        }
    }
    Group.init(
        {
            meeting: DataTypes.STRING,
            title: DataTypes.STRING,
            student: DataTypes.JSON,
            classID: DataTypes.STRING,
            note: DataTypes.TEXT('long'),
        },
        {
            sequelize,
            modelName: 'Group',
        },
    );
    return Group;
};
