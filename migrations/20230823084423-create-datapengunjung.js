'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('datapengunjungs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      picture: {
        type: Sequelize.TEXT
      },
      akurasi: {
        type: Sequelize.STRING
      },
      suhu: {
        type: Sequelize.FLOAT
      },
      statusSuhu: {
        type: Sequelize.STRING
      },
      waktu: {
        type: Sequelize.DATE
      },
      statusUser: {
        type: Sequelize.STRING
      },
      deviceId: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('datapengunjungs');
  }
};