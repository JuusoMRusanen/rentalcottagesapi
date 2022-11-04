module.exports = (sequelize, Sequelize) => {
  return sequelize.define("cottage", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    cityId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    bedrooms: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    bathrooms: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    size: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });
};