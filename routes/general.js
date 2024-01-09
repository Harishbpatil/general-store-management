
const express = require("express");
const router = express.Router();
const generalController = require("../controllers/general");


router.post("/", generalController.createItem);


router.get("/", generalController.getItems);


router.put("/:id", generalController.updateItem);


router.delete("/:id", generalController.deleteItem);

module.exports = router;
