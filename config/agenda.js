const Agenda = require("agenda");

const agenda = new Agenda({
  db: { address: process.env.DB_URL, collection: "mailjob" },
  processEvery: "1 minute",
});

(async () => await agenda.start())();

module.exports = agenda;
