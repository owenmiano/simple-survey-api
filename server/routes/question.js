const router=require("express").Router();
const questionControllers=require("../controllers/questionControllers")

/* 
url: /api/questions
method: GET
*/
router.get("/questions",questionControllers.fetchAllQuestions);

/* 
url: /api/questions/responses
method: POST
*/
router.post("/questions/responses",questionControllers.submitResponse);

/* 
url: /api/questions/responses
method: GET
*/
router.get("/questions/responses",questionControllers.fetchAllResponses);

/* 
url: /api/questions/responses/email
method: GET
*/
router.get("/questions/responses/:email",questionControllers.filterResponse);

/* 
url: /api/questions/responses/certificates/:id
method: GET
*/
router.get("/questions/responses/certificates/:id",questionControllers.downloadCertificate);

module.exports=router

