import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    pairKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "BLOCKED",
      ],
      default: "PENDING",
      index: true,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

connectionSchema.index({
  requester: 1,
  status: 1,
});

connectionSchema.index({
  recipient: 1,
  status: 1,
});

const Connection = mongoose.model(
  "Connection",
  connectionSchema
);

export default Connection;