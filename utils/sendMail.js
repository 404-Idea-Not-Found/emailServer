const nodemailer = require("nodemailer");

const Meeting = require("../model/Meeting");

async function sendMail(
  meetingId,
  type,
  deletedMeetingTitle = "",
  deletedMeetingReservation = []
) {
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  let mailOptions;

  if (type === "reservation") {
    const { _id, reservation, title } = await Meeting.findById(
      meetingId
    ).lean();

    mailOptions = {
      from: process.env.GMAIL_ID,
      to: reservation,
      subject: `404 Idea Not Found 미팅(${title}) 알림`,
      html: `<div>404 Idea Not Found에서 예약 하신 미팅(${title})이 시작합니다! 아래의 링크를 통해 참여해주세요.</div> \n https://www.404-idea-not-found.kr/main/meeting/detail/${_id}`,
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
