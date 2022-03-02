const express = require("express");

const {
  createNewMailJob,
  reCreateMailJob,
  deleteMailJob,
} = require("../controller/mailJob");
const verify404Token = require("../middlewares/verify404Token");
const router = express.Router();

router.post("/new-mail-job", verify404Token, createNewMailJob);
router.post("/mail-job/deletion/:meetingId", verify404Token, deleteMailJob);

router.patch("/mail-job", verify404Token, reCreateMailJob);

module.exports = router;
