const { expect } = require("chai");
const httpMocks = require("node-mocks-http");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const request = require("supertest");

const app = require("../../app");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../../utils/constants");
const signToken = require("../../utils/signToken");
const { mockUserList } = require("../mockData");

describe("mailjob", () => {
  const validToken = signToken(mockUserList[0]._id);
  let mockRequest = httpMocks.createRequest({
    method: "POST",
  });
  let mockResponse = httpMocks.createResponse();
  let fakeExpressNext = sinon.fake((error) => {
    mockResponse.statusCode = error.status;
    mockResponse.errorMessage = error.message;
  });

  afterEach(function () {
    mockRequest = httpMocks.createRequest({
      method: "POST",
    });
    mockResponse = httpMocks.createResponse();
    fakeExpressNext = sinon.fake((error) => {
      mockResponse.statusCode = error.status;
      mockResponse.errorMessage = error.message;
    });
  });

  it("should make mailjob on new meeting creation", async () => {
    const mockMeetingId = "621d02dc40cb39e0db59b3b9";
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    const dateString = date.toISOString();

    const response = await request(app)
      .post("/mail-job/new-mail-job")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ meetingId: mockMeetingId, startTime: dateString });

    expect(response.body.result).to.equal(RESPONSE_RESULT.OK);
  });

  describe("deleteMailjob", () => {
    const mockMeetingId = "621d02dc40cb39e0db59b3b9";
    const testMeetingTitle = "testTitle";
    const testMeetingReservation = ["test"];
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    const dateString = date.toISOString();

    beforeEach(async () => {
      await request(app)
        .post("/mail-job/new-mail-job")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ meetingId: mockMeetingId, startTime: dateString });
    });

    it("should delete mailjob on meeting cancel", async () => {
      const fakeSendmail = sinon.fake(() => {});
      const deleteMailJob = proxyquire("../../controller/mailJob", {
        "../utils/sendMail": fakeSendmail,
      }).deleteMailJob;

      await request(app)
        .post("/mail-job/new-mail-job")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ meetingId: mockMeetingId, startTime: dateString });

      mockRequest.params = { meetingId: mockMeetingId };
      mockRequest.body = {
        deletedMeetingTitle: testMeetingTitle,
        deletedMeetingReservation: testMeetingReservation,
      };

      await deleteMailJob(mockRequest, mockResponse);

      expect(fakeSendmail.getCall(0).firstArg).to.equal(mockMeetingId);
      expect(mockResponse.statusCode).to.equal(200);
    });

    it("should fail when failed to send mail", async () => {
      const testError = "helloError";
      const fakeSendmail = sinon.fake.rejects(testError);
      const deleteMailJob = proxyquire("../../controller/mailJob", {
        "../utils/sendMail": fakeSendmail,
      }).deleteMailJob;

      await request(app)
        .post("/mail-job/new-mail-job")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ meetingId: mockMeetingId, startTime: dateString });

      mockRequest.params = { meetingId: mockMeetingId };
      mockRequest.body = {
        deletedMeetingTitle: testMeetingTitle,
        deletedMeetingReservation: testMeetingReservation,
      };

      await deleteMailJob(mockRequest, mockResponse, fakeExpressNext);

      expect(mockResponse.statusCode).to.equal(500);
      expect(mockResponse.errorMessage).to.equal(
        ERROR_MESSAGES.FAILED_TO_DELETE_EMAIL_JOB
      );
    });
  });
});
