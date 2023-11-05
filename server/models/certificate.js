const { DataTypes } = require("sequelize");
const {sequelize}=require("../dbCon");
const Response = require("./response");

const Certificate = sequelize.define("Certificates", {

  certificate_data: {
    type: DataTypes.STRING,
    allowNull: false
    
  },
 
});
 
Response.hasMany(Certificate);
Certificate.belongsTo(Response);

module.exports=Certificate;
