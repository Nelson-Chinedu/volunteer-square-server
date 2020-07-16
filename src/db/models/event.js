'use strict';

const { Model } = require('sequelize');
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // define association here
    Event.belongsTo(models.Profile, { onDelete: 'CASCADE' })
    }
  };
  Event.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      autoIncrement: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    time: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.STRING,
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
    modelName: 'Event',
  });

  Event.beforeCreate(event => event.id = uuid.v4()); 
  
  return Event;
};