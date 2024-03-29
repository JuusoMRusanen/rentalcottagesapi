module.exports = (sequelize, Sequelize) => {
  return sequelize.define("photo", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cottageId: {
      type: Sequelize.INTEGER
    },
    src: {
      type: Sequelize.STRING
    },
    priority: { 
      type: Sequelize.INTEGER
    }
  },
  { 
    timestamps: false 
  }
  );
};