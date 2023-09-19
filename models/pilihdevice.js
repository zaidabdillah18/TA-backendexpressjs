'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pilihdevice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'id_user'})
      this.belongsTo(models.device, { foreignKey: 'id_device'})
    }
  }
  pilihdevice.init({
    id_user: DataTypes.INTEGER,
    id_device: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pilihdevice',
  });
  return pilihdevice;
};