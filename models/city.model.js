module.exports = (sequelize, Sequelize) => {
  return sequelize.define("city", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    regionId: {
      type: Sequelize.INTEGER,
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