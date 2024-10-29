const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("users", "postgres", "Sougga@1212", {
  host : "localhost",
  dialect : "postgres",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = connectDB;
module.exports.sequelize = sequelize;
