const { connectDB } = require("../dbCon");
const xml2js = require("xml2js");

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
    name: "review",
  },
];

exports.fetchAllQuestions = async (req, res) => {
  try {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject({ questions: { question: questions } });
    res.set("Content-Type", "application/xml");
    return res.status(200).send(xml);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Unable to fetch questions" });
  }
};

// submit response to questions
exports.submitResponse = async (req, res) => {
  const connection = await connectDB();

  const { full_name, email_address, description, gender, programming_stack } =
    req.body;
  const { files } = req;

  // ...

  if (!files || Object.keys(files).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const pdfFiles = Array.isArray(files.pdf) ? files.pdf : [files.pdf];

  try {
    await connection.beginTransaction();

    const [newResponse] = await connection.execute(
      "INSERT INTO responses (full_name, email_address, description, gender, programming_stack) VALUES (?, ?, ?, ?, ?)",
      [full_name, email_address, description, gender, programming_stack]
    );

    const ResponseId = newResponse.insertId;

    // ...

    const uploadPromises = pdfFiles.map(async (pdfUploadFile) => {
      const newPdfName = pdfUploadFile.name;
      const uploadPath =
        require("path").resolve("./") + "/server/uploads/" + newPdfName;

      await pdfUploadFile.mv(uploadPath);

      const pdfPath = "uploads/" + newPdfName;

      await connection.execute(
        "INSERT INTO certificates (ResponseId, certificate_data) VALUES (?, ?)",
        [ResponseId, pdfPath]
      );
    });
    await Promise.all(uploadPromises);

    await connection.commit();

    return res.status(200).json({ message: "Files uploaded successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error uploading files." });
  }
};
//  Fetch all responses
exports.fetchAllResponses = async (req, res) => {
  const connection = await connectDB();

  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 4;

    // Fetch responses with pagination using raw queries
    const [rows] = await connection.execute(`
    SELECT
    responses.*,
    GROUP_CONCAT(certificates.certificateid) as certificate_id,
    GROUP_CONCAT(certificates.certificate_data) as certificate_data
  FROM responses
  LEFT JOIN certificates ON responses.id = certificates.ResponseId
  GROUP BY responses.id;
    `);
    if (rows.length > 0) {
      //       // Calculate total pages
      const totalPages = Math.ceil(rows.length / pageSize);

      // Calculate start index and end index for the current page
      const startIndex = (page - 1) * pageSize;

      // Calculate start index and end index for the current page
      const endIndex = startIndex + pageSize;

      // Extract responses for the current page
      const responsesForPage = rows.slice(startIndex, endIndex);

      const xmlData = {
        responses: [],
      };

      responsesForPage.forEach((response) => {
        // Split concatenated values into arrays
        const certificateIds = response.certificate_id
          ? response.certificate_id.split(",")
          : [];
        const certificateData = response.certificate_data
          ? response.certificate_data.split(",")
          : [];
        // Create a new response with certificates array
        const newResponse = {
          id: response.id,
          full_name: response.full_name,
          email_address: response.email_address,
          description: response.description,
          gender: response.gender,
          programming_stack: response.programming_stack,
          createdAt: response.createdAt.toISOString(),
          certificates: [],
        };

        // Populate certificates array
        for (let i = 0; i < certificateIds.length; i++) {
          newResponse.certificates.push({
            certificateid: certificateIds[i],
            certificate_data: certificateData[i],
          });
        }

        xmlData.responses.push(newResponse);
      });

      const xmlBuilder = new xml2js.Builder();
      const xml = xmlBuilder.buildObject({
        responses: {
          response: xmlData.responses,
          pagination: {
            page,
            pageSize,
            totalPages,
          },
        },
      });

      res.set("Content-Type", "application/xml");
      return res.status(200).send(xml);
    } else {
      // Handle the case where there's no data on any page
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to fetch responses" });
  }
};

// filter response by email
exports.filterResponse = async (req, res) => {
  const connection = await connectDB();

  try {
    const emailToFind = req.params.email;
    // Calculate the offset to skip the appropriate number of records based on the page
    const [rows] = await connection.execute(
      `
          SELECT
      responses.*,
      GROUP_CONCAT(certificates.certificateid) as certificate_id,
      GROUP_CONCAT(certificates.certificate_data) as certificate_data
    FROM responses
    LEFT JOIN certificates ON responses.id = certificates.ResponseId
    WHERE responses.email_address = ?
    GROUP BY responses.id;
    
`,
      [emailToFind]
    );

    if (rows.length > 0) {
      const xmlData = {
        responses: [],
      };

      rows.forEach((response) => {
        // Split concatenated values into arrays
        const certificateIds = response.certificate_id
          ? response.certificate_id.split(",")
          : [];
        const certificateData = response.certificate_data
          ? response.certificate_data.split(",")
          : [];

        // Create a new response with certificates array
        const newResponse = {
          id: response.id,
          full_name: response.full_name,
          email_address: response.email_address,
          description: response.description,
          gender: response.gender,
          programming_stack: response.programming_stack,
          createdAt: response.createdAt.toISOString(),
          certificates: [],
        };

        // Populate certificates array
        for (let i = 0; i < certificateIds.length; i++) {
          newResponse.certificates.push({
            certificateid: certificateIds[i],
            certificate_data: certificateData[i],
          });
        }

        xmlData.responses.push(newResponse);
      });

      const xmlBuilder = new xml2js.Builder();
      const xml = xmlBuilder.buildObject({
        responses: {
          response: xmlData.responses,
        },
      });

      res.set("Content-Type", "application/xml");
      return res.status(200).send(xml);
    } else {
      // Handle the case where there's no data on any page
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch responses by email" });
  }
};

// find certificate by Id and Download
exports.downloadCertificate = async (req, res) => {
  const connection = await connectDB();

  try {
    const certificateId = req.params.id;
    const [rows] = await connection.execute(
      `
    SELECT *
    FROM certificates
    WHERE certificateid = ?
`,
      [certificateId]
    );

    const certificate = rows[0];
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
