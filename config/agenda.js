const Agenda = require("agenda");

const sendMail = require("../utils/sendMail");

const agenda = new Agenda({
  db: { address: process.env.DB_URL, collection: "mailJob" },
  processEvery: "30 seconds",
});

agenda.define("send meeting email", async (job) => {
  const { meetingId } = job.attrs.data;
  await sendMail(meetingId, "reservation");
});

(async () => await agenda.start())();

module.exports = agenda;
