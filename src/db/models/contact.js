'use strict';

const { Model } = require('sequelize');
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      // define association here
    Contact.belongsTo(models.Event, { onDelete: 'CASCADE' })
    }
  };
  Contact.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      autoIncrement: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    eventId: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'Events',
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

  Contact.beforeCreate(contact => contact.id = uuid.v4()); 
  
  return Contact;
};