'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'adminId'})
    }
  }
  AdminDetail.init({
    fullName: DataTypes.STRING,
    mobile: DataTypes.STRING,
    address: DataTypes.STRING,
    province: DataTypes.STRING,
    city: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    adminId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AdminDetail',
  });
  return AdminDetail;
};