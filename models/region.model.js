module.exports = (sequelize, Sequelize) => {
  return sequelize.define("region", {
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