import mongoose from "mongoose";

const messageSchema =
  new mongoose.Schema(
    {
      conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
      },

      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      text: {
        type: String,
        trim: true,
        maxlength: 5000,
        default: "",
      },

      attachments: [
        {
          url: {
            type: String,
            required: true,
          },

          type: {
            type: String,
            default: "file",
          },

          name: {
            type: String,
            default: "",
          },
        },
      ],

      readBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

messageSchema.index({
  conversation: 1,
  createdAt: 1,
});

const Message =
  mongoose.model(
    "Message",
    messageSchema
  );

export default Message;