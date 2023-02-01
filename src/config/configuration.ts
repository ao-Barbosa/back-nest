export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT || '5000', 10),
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_CONNECTION_URL: process.env.MONGO_CONNECTION_URL,
});
