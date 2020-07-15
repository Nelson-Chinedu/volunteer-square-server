'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      // define association here
    }
  };
  Account.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    blocked: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN,
    profileId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Account',
  });
  
  return Account;
};