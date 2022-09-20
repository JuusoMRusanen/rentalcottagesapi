module.exports = (sequelize, Sequelize) => {
  return sequelize.define("review", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cottageID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    nickName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    comment: {
      type: Sequelize.TEXT,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false
    }
  },
  { 
    timestamps: false 
  }
  );
};