exports.ERROR_MESSAGES = {
  FAILED_TO_GET_404_TOKEN: "ERROR: Failed to get 404 token from request",
  FAILED_TO_GET_USER: "ERROR: Failed to get user from DB",
  FAILED_TO_COMMUNICATE_WITH_DB: "ERROR: Failed to communicate with DB",
  FAILED_TO_VERIFY_TOKEN: "ERROR: Failed to verify 404 token.",
  FAILED_TO_CREATE_EMAIL_JOB: "ERROR: Failed to create email-job.",
  FAILED_TO_DELETE_EMAIL_JOB: "ERROR: Failed to delete email-job.",
  FAILED_TO_RECREATE_EMAIL_JOB: "ERROR: Failed to recreate email-job.",
};
exports.RESPONSE_RESULT = {
  ERROR: "error",
  OK: "ok",
  TOKEN_VERIFIED: "404 token verified",
  NO_TOKEN: "no 404 Token",
  NO_USER: "no user",
};
