'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namalengkap: {
        type: Sequelize.STRING
      },
      nohp: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      provinsi: {
        type: Sequelize.STRING
      },
      kota: {
        type: Sequelize.STRING
      },
      kodepos: {
        type: Sequelize.STRING
      },
      tempatlahir: {
        type: Sequelize.STRING
      },
      tanggallahir: {
        type: Sequelize.DATE
      },
      jeniskelamin: {
        type: Sequelize.STRING
      },
      agama: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('UserDetails');
  }
};