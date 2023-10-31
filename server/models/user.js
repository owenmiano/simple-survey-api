const { DataTypes } = require("sequelize");
const {sequelize}=require("../dbCon")

const User = sequelize.define("Users", {
  full_name: {
     type: DataTypes.STRING,
     allowNull: false
   },
   email_address: {
     type: DataTypes.STRING,
     allowNull: false
   },
   description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  gender: {
     type: DataTypes.STRING,
     allowNull: false    
   },
   programming_stack: {
    type: DataTypes.STRING,
    allowNull: false
   }, 
});



module.exports=User;
