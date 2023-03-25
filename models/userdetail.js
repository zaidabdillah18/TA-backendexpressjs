'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId'})
      
    }
  }
  UserDetail.init({
    namalengkap: DataTypes.STRING,
    nohp: DataTypes.STRING,
    alamat: DataTypes.STRING,
    provinsi: DataTypes.STRING,
    kota: DataTypes.STRING,
    kodepos: DataTypes.STRING,
    tempatlahir: DataTypes.STRING,
    tanggallahir: DataTypes.DATE,
    jeniskelamin: DataTypes.STRING,
    agama: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserDetail',
  });
  return UserDetail;
};