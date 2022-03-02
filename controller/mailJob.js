const agenda = require("../config/agenda");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");
const sendMail = require("../utils/sendMail");

exports.createNewMailJob = async (req, res, next) => {
  const { meetingId, startTime } = req.body;

  try {
    await agenda.schedule(new Date(startTime), "send meeting email", {
      meetingId,
    });

    res.json({ result: RESPONSE_RESULT.OK });
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_CREATE_EMAIL_JOB
      )
    );
  }
};

exports.reCreateMailJob = async (req, res, next) => {
  const { meetingId, startTime } = req.body;

  try {
    await agenda.cancel({ "data.meetingId": meetingId });
    await sendMail(meetingId, "reschedule");
    await agenda.schedule(new Date(startTime), "send meeting email", {
      meetingId,
    });

    res.json({ result: RESPONSE_RESULT.OK });
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_RECREATE_EMAIL_JOB
      )
    );
  }
};

exports.deleteMailJob = async (req, res, next) => {
  const { meetingId, deletedMeetingTitle, deletedMeetingReservation } =
    req.body;

  try {
    await agenda.cancel({ "data.meetingId": meetingId });
    await sendMail(
      meetingId,
      "cancel",
      deletedMeetingTitle,
      deletedMeetingReservation
    );

    res.json({ result: RESPONSE_RESULT.OK });
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_DELETE_EMAIL_JOB
      )
    );
  }
};
