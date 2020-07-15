'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Accounts', [{
      id: "7cfeb5ce-5951-4c0b-9fa0-49c7dbb82d51",
      email: "test1@email.com",
      password: "$2b$10$9gNFpjVR9P/vdd5k..fi/Ox.d1QVaoiIdTRnZtpcOlsE7E4lwXIpi",
      blocked: false,
      verified: false,
      profileId: "ffc2456f-3bde-41fb-b3d0-6b31784692c7",
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Accounts', null, {});
  }
};
