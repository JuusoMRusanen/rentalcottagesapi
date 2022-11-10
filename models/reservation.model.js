module.exports = (sequelize, Sequelize) => {
  return sequelize.define("reservation", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    cottageId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    homeAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    postalCode: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    postalDistrict: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cleanUp: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    finalPrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    startDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    endDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};