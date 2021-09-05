const express = require("express");
const router = express.Router();

const checkController = require('../controllers/check');
const checkAuth = require('../middleware/check-auth');


router.get("/", checkAuth, checkController.get_all_checks);

router.post("/", checkAuth, checkController.add_check);

router.delete("/:checkId", checkAuth, checkController.delete_check);

router.get("/pause/:checkId", checkAuth, checkController.pause_check);

router.get("/resume/:checkId", checkAuth, checkController.resume_check);

router.put("/:checkId", checkAuth, checkController.update_check);

module.exports = router;
