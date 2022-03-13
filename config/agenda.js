const Agenda = require("agenda");

const sendMail = require("../utils/sendMail");
const dbUrl =
  process.env.NODE_ENV === "test"
    ? process.env.LOCAL_DB_URL
    : process.env.DB_URL;

const agenda = new Agenda({
  db: { address: dbUrl, collection: "mailJob" },
  processEvery: "30 seconds",
});

agenda.define("send meeting email", async (job) => {
  const { meetingId } = job.attrs.data;
  await sendMail(meetingId, "reservation");
});

(async () => await agenda.start())();

module.exports = agenda;
