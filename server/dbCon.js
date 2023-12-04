const mysql = require('mysql2/promise');

async function connectDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    if(connection){
      console.log("MySQL connected successfully")
    }
    // Create responses table
    const createResponsesTableQuery = `
      CREATE TABLE IF NOT EXISTS responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email_address VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        gender VARCHAR(255) NOT NULL,
        programming_stack VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createResponsesTableQuery);
    // console.log("Responses table created");

    // Create certificates table
    const createCertificatesTableQuery = `
      CREATE TABLE IF NOT EXISTS certificates (
        certificateid INT AUTO_INCREMENT PRIMARY KEY,
        certificate_data VARCHAR(255) NOT NULL,
        ResponseId INT,
        FOREIGN KEY (ResponseId) REFERENCES responses(id)
      )
    `;
    await connection.execute(createCertificatesTableQuery);
    // console.log("Certificates table created");

    return connection; // Return the connection for external use

  } catch (error) {
    console.error("Error creating tables:", error);
    return null; // Return null in case of an error
  }
}

module.exports = {
  connectDB,
};
