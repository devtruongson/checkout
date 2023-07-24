'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Meetings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            day: {
                type: Sequelize.STRING,
            },
            startTime: {
                type: Sequelize.STRING,
            },
            endTime: {
                type: Sequelize.STRING,
            },
            groupID: {
                type: Sequelize.STRING,
            },
            isDone: {
                type: Sequelize.BOOLEAN,
            },
            isCancelled: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            isTeacher: {
                type: Sequelize.BOOLEAN,
            },
            idTeacher: {
                type: Sequelize.STRING,
            },
            count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Meetings');
    },
};
