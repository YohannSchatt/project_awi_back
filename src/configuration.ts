// This file is used to define the configuration of the application.

export default () => ({
    jwt: {
      secret: process.env.JWT_KEY || 'default_secret_key',
      expiresIn: process.env.JWT_EXPIRATION || '3600s',
    },
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      user: process.env.DATABASE_USER || 'default_user',
      password: process.env.DATABASE_PASSWORD || 'default_password',
      url : process.env.DATABASE_URL || 'default_url',
    },
  });