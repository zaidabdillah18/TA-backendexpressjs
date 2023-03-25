'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class datapengunjung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId'})
      this.belongsTo(models.device, { foreignKey: 'deviceId'})
    }
  }
  datapengunjung.init({
    nama: DataTypes.STRING,
    picture: DataTypes.TEXT,
    akurasi: DataTypes.STRING,
    suhu: DataTypes.FLOAT,
    statusSuhu: DataTypes.STRING,
    waktu: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    deviceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'datapengunjung',
  });
  return datapengunjung;
};