const express = require("express");

const { createNewMailJob, deleteMailJob } = require("../controller/mailJob");
const verify404Token = require("../middlewares/verify404Token");
const router = express.Router();

router.post("/new-mail-job", verify404Token, createNewMailJob);
router.post("/deletion/:meetingId", verify404Token, deleteMailJob);

module.exports = router;
