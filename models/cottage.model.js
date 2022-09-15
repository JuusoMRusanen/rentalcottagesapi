module.exports = (sequelize, Sequelize) => {
  return sequelize.define("cottage", {
    cityId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    bedrooms: {
      type: Sequelize.INTEGER
    },
    bathrooms: {
      type: Sequelize.INTEGER
    },
    price: {
      type: Sequelize.INTEGER
    },
    size: {
      type: Sequelize.INTEGER
    }
  });
};