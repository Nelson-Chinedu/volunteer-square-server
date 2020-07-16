'use strict';

const { Model } = require('sequelize');
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      // define association here
      Profile.hasMany(models.Event, { onDelete: 'CASCADE' })
    }
  };
  Profile.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      autoIncrement: false,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    city: { 
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });

  Profile.beforeCreate(account => account.id = uuid.v4()); 
  
  return Profile;
};
