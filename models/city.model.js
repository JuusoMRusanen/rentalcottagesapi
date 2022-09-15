module.exports = (sequelize, Sequelize) => {
  return sequelize.define("city", {
    regionId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    timestamps: false 
  }
  );
};