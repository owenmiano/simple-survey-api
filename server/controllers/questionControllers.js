const Response = require("../models/response");
const Certificate = require("../models/certificate");
const { sequelize } = require("../dbCon");

const questions = [
  {
    name: "full_name",
    type: "text",
    required: "yes",
    text: "What is your full name?",
    description: "[Surname] [First Name] [Other Names]",
  },
  {
    name: "email_address",
    type: "text",
    required: "yes",
    text: "What is your email address?",
    description: "",
  },
  {
    name: "gender",
    type: "radio",
    text: "What is your gender?",
    description: "Select your response.",
    options: ["Male", "Female", "Other"],
    required: "yes",
  },
  {
    name: "description",
    type: "long_text",
    required: "yes",
    text: "Tell us a bit more about yourself?",
    description: "",
  },
  {
    name: "programming_stack",
    type: "checkbox",
    text: "Which programming stacks are you familiar with? Select at least one",
    description: "You can select multiple",
    options: [
      "REACT",
      "ANGULAR",
      "VUE",
      "SQL",
      "POSTGRES",
      "MYSQL",
      "MSSQL",
      "Java",
      "PHP",
      "GO",
      "RUST",
    ],
    required: "yes",
  },

  {
    name: "pdf",
    type: "file",
    required: "yes",
    text: "Upload any of your certificates",
    description: "You can upload multiple (.pdf)",
  },
  {
   name: "review"

  }
];

//   Fetch all list of questions
exports.fetchAllQuestions = async (req, res) => {
  try {
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch questions" });
  }
};

// submit response to questions
exports.submitResponse = async (req, res) => {
  const { full_name, email_address, description, gender, programming_stack } =
    req.body;
  const { files } = req;

  if (!files || Object.keys(files).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const pdfFiles = Array.isArray(files.pdf) ? files.pdf : [files.pdf];

  try {
    const transaction = await sequelize.transaction();

    const newResponse = await Response.create(
      {
        full_name,
        email_address,
        description,
        gender,
        programming_stack,
      },
      { transaction }
    );

    const ResponseId = newResponse.id;

    // Create an array to store promises for each PDF upload operation
    const uploadPromises = pdfFiles.map(async (pdfUploadFile) => {
      const newPdfName = pdfUploadFile.name;
      const uploadPath =
        require("path").resolve("./") + "/server/uploads/" + newPdfName;

      await pdfUploadFile.mv(uploadPath);

      // Save the file path to the database
      const pdfPath = "uploads/" + newPdfName;

      // Create the Certificate entry and associate it with the user
      await Certificate.create(
        { ResponseId, certificate_data: pdfPath },
        { transaction }
      );
    });

    // Wait for all PDF upload operations to complete
    await Promise.all(uploadPromises);

    // Commit the transaction for all PDF uploads
    await transaction.commit();

    // Return a success response when all files are uploaded and saved
    return res.status(200).json({ message: "Files uploaded successfully." });
  } catch (error) {
    // Handle errors that occurred during the transaction
    console.error(error);
    return res.status(500).json({ message: "Error uploading files." });
  }
};

//  Fetch all responses
exports.fetchAllResponses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the requested page number
    const pageSize = parseInt(req.query.pageSize) || 5; // Number of responses per page

    // Calculate the offset to skip the appropriate number of records based on the page
    const offset = (page - 1) * pageSize;

    const responses = await Response.findAndCountAll({
      include: Certificate,
      offset,
      limit: pageSize,
    });

    const totalResponses = responses.count;
    const totalPages = Math.ceil(totalResponses / pageSize);
    if (totalPages > 0) {
      return res.status(200).json({ responses: responses.rows, totalPages });
    } else {
      // Handle the case where there's no data on any page
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch responses" });
  }
};

// filter response by email
exports.filterResponse = async (req, res) => {
  try {
    const emailToFind = req.params.email;
    const page = parseInt(req.query.page) || 1; // Get the requested page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of responses per page

    // Calculate the offset to skip the appropriate number of records based on the page
    const offset = (page - 1) * pageSize;

    const filteredResponse = await Response.findAndCountAll({
      include: Certificate,
      where: {
        email_address: emailToFind,
      },
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(filteredResponse.count / pageSize);

    return res.status(200).json({ responses: filteredResponse.rows, totalPages });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch responses by email" });
  }
};


// find certificate by Id and Download
exports.downloadCertificate = async (req, res) => {
  try {
    const certificateId = req.params.id;
    const certificate = await Certificate.findByPk(certificateId);

    const relativeFilePath = certificate.certificate_data;
    const absoluteFilePath =
      require("path").resolve("./") + "/server/" + relativeFilePath;
    res.download(absoluteFilePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Unable to download certificate" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch certificate by id" });
  }
};
