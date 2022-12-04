export default {
  jwt: {
    secret: process.env.APP_SECRET || 'no-value',
    expiresIn: '1d',
  },
};
