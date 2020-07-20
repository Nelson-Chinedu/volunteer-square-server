'use strict';

module.exports = {
  up: async (queryInterface: any) => {
   await queryInterface.bulkInsert('Profiles', [
     {
       id: 'ffc2456f-3bde-41fb-b3d0-6b31784692c7',
       firstname: 'Nelson',
       lastname: 'Chinedu',
       phoneNumber: '09012309328',
       imageUrl: '',
       city: 'Lagos',
       country: 'NG',
       createdAt: new Date(),
       updatedAt: new Date()
     },
     {
       id: '59d9bdf5-1dbf-459c-bb6e-0ff81ffff6ea',
       firstname: 'Jake',
       lastname: 'Larson',
       phoneNumber: '09012309328',
       imageUrl: '',
       city: '',
       country: '',
       createdAt: new Date(),
       updatedAt: new Date()
     }
   ],
   {},
   );
  },

  down: async (queryInterface: any) => {
    await queryInterface.bulkDelete('Profiles', null, {});
  }
};
