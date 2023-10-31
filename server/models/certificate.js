const { DataTypes } = require("sequelize");
const {sequelize}=require("../dbCon");
const User = require("./user");

const Certificate = sequelize.define("Certificates", {

  certificate_data: {
    type: DataTypes.STRING,
    allowNull: false
    
  },
 
});
 
User.hasMany(Certificate);
Certificate.belongsTo(User);

module.exports=Certificate;
