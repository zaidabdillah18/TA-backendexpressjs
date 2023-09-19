'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'admin_id'})
      this.hasMany(models.datapengunjung, { foreignKey: 'deviceId'})
    }
  }
  device.init({
    nama: DataTypes.STRING,
    ip: DataTypes.STRING,
    status: DataTypes.STRING,
    admin_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'device',
  });
  return device;
};