'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.pilihdevice, {foreignKey:'id_user'})
      this.hasOne(models.UserDetail, {foreignKey:'userId'})
      this.hasOne(models.AdminDetail, {foreignKey:'adminId'})
      this.hasOne(models.device, { foreignKey: 'admin_id'})
      this.hasOne(models.datawajah, { foreignKey: 'userId'})
      this.hasOne(models.datapengunjung, { foreignKey: 'userId'})
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.BOOLEAN,
    emailVerified: DataTypes.BOOLEAN,
    resetpasswordLink: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};