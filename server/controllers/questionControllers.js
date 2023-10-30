const Question=require('../models/question')

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
      console.log("No files were uploaded.");
    } else {
      const pdfFiles = Array.isArray(files.pdf) ? files.pdf : [files.pdf];
      const pdfPaths = [];
      pdfFiles.forEach(async (pdfUploadFile) => {
        const newPdfName = pdfUploadFile.name;
        const uploadPath = require("path").resolve("./") + "/server/uploads/" + newPdfName;
    
        try {
          await pdfUploadFile.mv(uploadPath);
    
          // Save the file path to the database
          const pdfPath = 'uploads/' + newPdfName;
          pdfPaths.push(pdfPath);
          const concatenatedPdfPaths = pdfPaths.join(',');
          await Question.create({
            full_name,
            email_address,
            description,
            gender,
            programming_stack,
            certificate_data: concatenatedPdfPaths,
          });
        } catch (err) {
          // Handle the error appropriately, e.g., return an error response
          console.error(err);
          return res.status(500).json({ message: "Error uploading file" });
        }
      });
    }
    
    // Return a success response when all files are uploaded and saved
    return res.status(200).json({ message: "Files uploaded successfully." });
    
    }

//  Fetch all responses
    exports.fetchAllResponses = async (req, res) => {
        try {
      
          return res.status(200).json(questions)
        } catch (error) {
          return res.status(500).json({message:"Unable to fetch questions"}) 
        }
        }
  

  