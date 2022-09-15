module.exports = (sequelize, Sequelize) => {
  return sequelize.define("photo", {
    src: {
      type: Sequelize.STRING
    },
    priority: { 
      type: Sequelize.INTEGER
    }
  });
};