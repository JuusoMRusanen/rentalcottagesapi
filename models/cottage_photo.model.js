module.exports = (sequelize, Sequelize) => {
  return sequelize.define("cottage_photo", {
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