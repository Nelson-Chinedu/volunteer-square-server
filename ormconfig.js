const dotenv = require('dotenv');

const isDevEnv = (() => process.env.NODE_ENV === 'development');

const getEnvVariables = {
   host: isDevEnv ? process.env.DB_HOST_DEV : process.env.DB_HOST_PROD,
   username: isDevEnv ? process.env.DB_USERNAME_DEV : process.env.DB_USERNAME_PROD,
   password: isDevEnv ? process.env.DB_PASSWORD_DEV : process.env.DB_PASSWORD_PROD,
   databasename: isDevEnv ? process.env.DB_DATABASE_DEV : process.env.DB_DATABASE_PROD,
   logging: isDevEnv ?  true : false,
   synchronize: isDevEnv ? true : false,
};

const entities = isDevEnv ? "src/db/entity/**/*.ts" : "build/db/entity/**/*.js";

module.exports = {
  "type": "postgres",
  "host": getEnvVariables.host,
  "port": 5432,
  "username": getEnvVariables.username,
  "password": getEnvVariables.password,
  "database": getEnvVariables.databasename,
  "synchronize": getEnvVariables.synchronize,
  "logging": getEnvVariables.logging,
  "entities": [entities],
  "migrations": [
     "src/migration/**/*.ts"
  ],
  "subscribers": [
     "src/subscriber/**/*.ts"
  ],
  "cli": {
     "entitiesDir": "src/entity",
     "migrationsDir": "src/migration",
     "subscribersDir": "src/subscriber"
  }
}