/* eslint-disable no-useless-escape */
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: [String],
  },
  description: {
    type: String,
    maxlength: 300,
    minlength: 10,
    required: true,
  },
  owner: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  reservation: {
    type: [
      {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Failed to validate email address",
        ],
      },
    ],
    default: [],
  },
  colleague: {
    type: [mongoose.ObjectId],
    ref: "User",
    default: [],
  },
  recruitmentNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  startTime: {
    type: Date,
    required: true,
  },
  chatList: {
    type: [chatSchema],
    default: [],
  },
  isLive: {
    type: Boolean,
    default: false,
  },
  isEnd: {
    type: Boolean,
    default: false,
  },
  ownerSocketId: {
    type: String,
  },
});

module.exports = mongoose.model("Meeting", meetingSchema);
