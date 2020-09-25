const dotenv = require("dotenv");

const isDevEnv = () => process.env.NODE_ENV === "development";

let connString =
  process.env.NODE_ENV === "development"
    ? process.env.DB_DEV_URL
    : process.env.DB_PROD_URL;

const getEnvVariables = {
  logging: isDevEnv ? true : false,
  synchronize: isDevEnv ? true : false,
};

const entities = isDevEnv()
  ? "src/db/entity/**/*.ts"
  : "./build/src/db/entity/**/*.js";

module.exports = {
  type: "postgres",
  url: connString,
  synchronize: getEnvVariables.synchronize,
  logging: getEnvVariables.logging,
  entities: [entities],
  migrations: ["src/db/migration/**/*.ts"],
  subscribers: ["src/db/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/db/entity",
    migrationsDir: "src/db/migration",
    subscribersDir: "src/db/subscriber",
  },
};
