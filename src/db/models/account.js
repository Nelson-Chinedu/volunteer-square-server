'use strict';

const uuid = require('uuid');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      // define association here
    Account.belongsTo(models.Profile, { 
      foreignKey: 'profileId',
      onDelete: 'CASCADE' 
    })
    }
  };
  Account.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      autoIncrement: false,
    },
    email: {
      unique: true,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: { 
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: [8, 255],
      }, 
    },
    blocked: { 
      type: DataTypes.BOOLEAN,
    },
    verified: { 
      type: DataTypes.BOOLEAN,
    },
    profileId: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'Profiles',
        },
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }
  }, {
    sequelize,
    modelName: 'Account',
  });

  Account.beforeCreate(account => account.id = uuid.v4()); 
  
  return Account;
};