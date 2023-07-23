'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Groups', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            meeting: {
                type: Sequelize.STRING,
            },
            title: {
                type: Sequelize.STRING,
            },
            classID: {
                type: Sequelize.STRING,
            },
            student: {
                type: Sequelize.JSON,
            },
            note: {
                type: Sequelize.TEXT('long'),
            },
            link: {
                type: Sequelize.TEXT('long'),
            },
            linkStudent: {
                type: Sequelize.TEXT('long'),
            },
            notify: {
                type: Sequelize.TEXT('long'),
            },
            active: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            isDone: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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
        await queryInterface.dropTable('Groups');
    },
};
