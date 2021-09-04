const express = require("express");
const router = express.Router();

const reportController = require('../controllers/report');
const checkAuth = require('../middleware/check-auth');

router.get("/:checkId", checkAuth, reportController.get_report);

module.exports = router;
