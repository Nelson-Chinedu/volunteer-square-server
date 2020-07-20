'use strict';

import { Model } from 'sequelize';
import uuid from 'uuid';

module.exports = (sequelize: any, DataTypes: any) => {
  class Profile extends Model {
    static associate(models: any) {
      // define association here
      Profile.hasMany(models.Event, { onDelete: 'CASCADE' });
    }
  }
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
