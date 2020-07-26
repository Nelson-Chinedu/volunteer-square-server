module.exports = {
  "type": "postgres",
  "host": "localhost",
  "port": process.env.DEV_PORT,
  "username": process.env.DEV_DATABASE_USER,
  "password": process.env.DEV_DATABASE_PASSWORD,
  "database": process.env.DEV_DATABASE,
  "synchronize": true,
  "logging": true,
  "entities": [
     "src/db/entity/**/*.ts"
  ],
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