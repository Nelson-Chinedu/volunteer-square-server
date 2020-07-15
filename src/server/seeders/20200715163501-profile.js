'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.bulkInsert('Profiles', [{
    id: "ffc2456f-3bde-41fb-b3d0-6b31784692c7",
    firstname: "Nelson",
    lastname: "Chinedu",
    phoneNumber: "09012309328",
    imageUrl: "",
    city: "",
    country: "",
    createdAt: new Date(),
    updatedAt: new Date()
  }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Profiles', null, {});
  }
};
