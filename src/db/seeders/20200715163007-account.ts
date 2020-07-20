// 'use strict';

module.exports = {
  up: async (queryInterface: any) => {
    await queryInterface.bulkInsert('Accounts', [
      {
        id: '7cfeb5ce-5951-4c0b-9fa0-49c7dbb82d51',
        email: 'test1@email.com',
        password: '$2b$10$9gNFpjVR9P/vdd5k..fi/Ox.d1QVaoiIdTRnZtpcOlsE7E4lwXIpi',
        blocked: false,
        verified: true,
        profileId: 'ffc2456f-3bde-41fb-b3d0-6b31784692c7',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
      id: 'cd2b4525-6e84-41e8-8c79-efe71114ff40',
      email: 'test2@email.com',
      password: '$2b$10$9gNFpjVR9P/vdd5k..fi/Ox.d1QVaoiIdTRnZtpcOlsE7E4lwXIpi',
      blocked: false,
      verified: false,
      profileId: '59d9bdf5-1dbf-459c-bb6e-0ff81ffff6ea',
      createdAt: new Date(),
      updatedAt: new Date()
  }
  ]);
  },

  down: async (queryInterface: any) => {
    await queryInterface.bulkDelete('Accounts', null, {});
  }
};
