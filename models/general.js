const Sequelize = require("sequelize");
const sequelize = require("../util/db");

const General = sequelize.define("general", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  item: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// Synchronize the model with the database
sequelize.sync().then(() => {
  console.log("General model synchronized successfully");
});

module.exports = { General };
