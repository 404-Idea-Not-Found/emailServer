const dayjs = require("dayjs");
const nodemailer = require("nodemailer");

const Meeting = require("../model/Meeting");

async function sendMail(
  meetingId,
  type,
  deletedMeetingTitle = "",
  deletedMeetingReservation = []
) {
  const { _id, reservation, title, startTime } = await Meeting.findById(
    meetingId
  ).lean();
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  let mailOptions;

  if (type === "reservation") {
    mailOptions = {
      from: process.env.GMAIL_ID,
      to: reservation,
      subject: `404 Idea Not Found 미팅(${title}) 알림`,
      html: `<div>404 Idea Not Found에서 예약 하신 미팅(${title})이 시작합니다! 아래의 링크를 통해 참여해주세요.</div> \n https://www.404-idea-not-found.kr/main/meeting/${_id}`,
    };
  }

  if (type === "reschedule") {
    const formattedDate = dayjs(startTime).format("YYYY-MM-DD HH:mm");

    mailOptions = {
      from: process.env.GMAIL_ID,
      to: reservation,
      subject: `404 Idea Not Found 미팅(${title}) 시간 변경 알림`,
      html: `<div>404 Idea Not Found에서 예약 하신 미팅(${title})의 시간이 ${formattedDate} 으로 변경되었습니다.</div>`,
    };
  }

  if (type === "cancel") {
    mailOptions = {
      from: process.env.GMAIL_ID,
      to: deletedMeetingReservation,
      subject: `404 Idea Not Found 미팅(${deletedMeetingTitle}) 취소 알림`,
      html: `<div>404 Idea Not Found에서 예약 하신 미팅(${deletedMeetingTitle})이 취소되었습니다.</div>`,
    };
  }

  await mailTransporter.sendMail(mailOptions);
}

module.exports = sendMail;
