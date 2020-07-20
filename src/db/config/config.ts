import dotenv from 'dotenv';
dotenv.config();

const config = {
  'development': {
    'username': process.env.DEV_DATABASE_USER,
    'password': process.env.DEV_DATABASE_PASSWORD,
    'database': process.env.DEV_DATABASE,
    'port': process.env.DEV_PORT,
    'dialect': 'postgres'
  },
};

export default config;
