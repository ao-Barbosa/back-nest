// # Server
// PORT=5000

// # Auth
// JWT_SECRET="your >32 character string secret here"

// # Database
// # Usually goes like mongodb://host:port/database
// # MONGO_CONNECTION_URL="mongodb://127.0.0.1:27017/basicPtflDB"
// MONGO_CONNECTION_URL="mongodb+srv://mainDataAccess:nbOJapaChEzhleOB@aobarbosadev.f4qp4.mongodb.net/portifolio?retryWrites=true&w=majority"

export default () => ({
  PORT: 0,
  JWT_SECRET: '',
  MONGO_CONNECTION_URL: '',
});
