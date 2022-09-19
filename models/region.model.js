module.exports = (sequelize, Sequelize) => {
  return sequelize.define("region", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
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