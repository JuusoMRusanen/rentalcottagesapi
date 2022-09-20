module.exports = (sequelize, Sequelize) => {
  return sequelize.define("cottage_photo", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cottageId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    photoId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  { 
    timestamps: false 
  }
  );
};