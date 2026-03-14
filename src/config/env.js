'use strict';

const REQUIRED_IN_PRODUCTION = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'SESSION_SECRET',
  'APP_URL',
];

const defaults = {
  APP_PORT: '3000',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'denovonomo',
  DB_PASSWORD: '',
  DB_NAME: 'denovonomo',
  SESSION_SECRET: 'dev-secret-change-me',
  NODE_ENV: 'development',
  APP_URL: 'http://localhost:3000',
  ADMIN_EMAIL: '',
  ADMIN_PASSWORD: '',
};

function loadEnv() {
  const env = {};

  for (const [key, defaultValue] of Object.entries(defaults)) {
    env[key] = process.env[key] || defaultValue;
  }

  env.APP_PORT = parseInt(env.APP_PORT, 10);
  env.DB_PORT = parseInt(env.DB_PORT, 10);

  if (env.NODE_ENV === 'production') {
    const missing = REQUIRED_IN_PRODUCTION.filter(
      (key) => !process.env[key] || process.env[key].trim() === ''
    );
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables in production: ${missing.join(', ')}`
      );
    }
  }

  return Object.freeze(env);
}

module.exports = loadEnv();
