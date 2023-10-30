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

module.exports=router

