const User=require('../models/user')
const Certificate=require('../models/certificate')
const {sequelize}=require("../dbCon");

const questions=[
    {
      "name": "full_name",
      "type": "text",
      "required":"yes",
      "text": "What is your full name?",
      "description": "[Surname] [First Name] [Other Names]"
    },
    {
        "name": "email_address",
        "type": "text",
        "required":"yes",
        "text": "What is your email_address?",
        "description": ""
      },
    {
        "name": "description",
        "type": "long_text",
        "required":"yes",
        "text": "Tell us a bit more about yourself?",
        "description": ""
      },

    {
      "name": "gender",
      "type": "radio",
      "text": "What is your gender?",
      "description": "Select your response.",
      "options": ["Male", "Female","Other"]
    },
    
    {
        "name": "programming_stack",
        "type": "checkbox",
        "text": "What programming stack are you familiar with?",
        "description": "You can select multiple",
        "options": ["REACT", "ANGULAR","VUE","SQL","POSTGRES","MYSQL","MSSQL","Java","PHP","GO","RUST"]
      },
      
    {
        "name": "certificates",
        "type": "file",
        "required":"yes",
        "text": "Upload any of your certificates?",
        "description": "You can upload multiple (.pdf)",
      }
  ]

//   Fetch all list of questions
  exports.fetchAllQuestions = async (req, res) => {
  try {

    return res.status(200).json(questions)
  } catch (error) {
    return res.status(500).json({message:"Unable to fetch questions"}) 
  }
  }

// submit response to questions
  exports.submitResponse = async (req, res) => {
    const { full_name, email_address, description, gender, programming_stack } = req.body;
    const { files } = req;
    
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }
    
    const pdfFiles = Array.isArray(files.pdf) ? files.pdf : [files.pdf];
    
    try {
      const transaction = await sequelize.transaction();
    
      // Create the user entry outside of the PDF upload loop
      const newUser = await User.create(
        {
          full_name,
          email_address,
          description,
          gender,
          programming_stack,
        },
        { transaction }
      );
    
      // Assuming you have the newly created user's ID
      const UserId = newUser.id;
    
      // Create an array to store promises for each PDF upload operation
      const uploadPromises = pdfFiles.map(async (pdfUploadFile) => {
        const newPdfName = pdfUploadFile.name;
        const uploadPath = require('path').resolve('./') + '/server/uploads/' + newPdfName;
    
        await pdfUploadFile.mv(uploadPath);
    
        // Save the file path to the database
        const pdfPath = 'uploads/' + newPdfName;
    
        // Create the Certificate entry and associate it with the user
        await Certificate.create(
          { UserId, certificate_data: pdfPath },
          { transaction }
        );
      });
    
      // Wait for all PDF upload operations to complete
      await Promise.all(uploadPromises);
    
      // Commit the transaction for all PDF uploads
      await transaction.commit();
    
      // Return a success response when all files are uploaded and saved
      return res.status(200).json({ message: 'Files uploaded successfully.' });
    } catch (error) {
      // Handle errors that occurred during the transaction
      console.error(error);
      return res.status(500).json({ message: 'Error uploading files.' });
    }
    

  }

//  Fetch all responses
    exports.fetchAllResponses = async (req, res) => {
        try {
      
          return res.status(200).json(questions)
        } catch (error) {
          return res.status(500).json({message:"Unable to fetch questions"}) 
        }
        }
  

  