import mongoose from "mongoose";

const conversationSchema =
  new mongoose.Schema(
    {
      participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],

      participantsKey: {
        type: String,
        unique: true,
        required: true,
        index: true,
      },

      lastMessageText: {
        type: String,
        default: "",
      },

      lastMessageAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

conversationSchema.index({
  participants: 1,
});

const Conversation =
  mongoose.model(
    "Conversation",
    conversationSchema
  );

export default Conversation;