module.exports = (sequelize, Sequelize) => {
  return sequelize.define("region", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
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