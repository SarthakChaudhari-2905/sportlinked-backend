import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Connection from "../models/Connection.js";

const makeParticipantsKey = (
  a,
  b
) => {
  return [
    a.toString(),
    b.toString(),
  ]
    .sort()
    .join(":");
};

const ensureConnected = async (
  userId,
  recipientId
) => {
  const key = makeParticipantsKey(
    userId,
    recipientId
  );

  const connection =
    await Connection.findOne({
      pairKey: key,
      status: "ACCEPTED",
    });

  if (!connection) {
    const error = new Error(
      "You can message users after connecting with them"
    );

    error.statusCode = 403;

    throw error;
  }
};

const getOrCreateConversation = async (
  userId,
  recipientId
) => {
  if (
    userId.toString() ===
    recipientId.toString()
  ) {
    const error = new Error(
      "You cannot message yourself"
    );

    error.statusCode = 400;

    throw error;
  }

  const recipient =
    await User.findOne({
      _id: recipientId,
      isActive: true,
      isDeleted: false,
      accountStatus: "ACTIVE",
    });

  if (!recipient) {
    const error = new Error(
      "Recipient not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await ensureConnected(
    userId,
    recipientId
  );

  const participantsKey =
    makeParticipantsKey(
      userId,
      recipientId
    );

  let conversation =
    await Conversation.findOne({
      participantsKey,
    });

  if (!conversation) {
    conversation =
      await Conversation.create({
        participants: [
          userId,
          recipientId,
        ],
        participantsKey,
      });
  }

  return conversation.populate(
    "participants",
    "firstName lastName username avatar role"
  );
};

const getMyConversations = async (
  userId
) => {
  const conversations =
    await Conversation.find({
      participants: userId,
    })
      .populate(
        "participants",
        "firstName lastName username avatar role"
      )
      .sort({
        lastMessageAt: -1,
        updatedAt: -1,
      });

  return Promise.all(
    conversations.map(
      async (conversation) => {
        const unreadCount =
          await Message.countDocuments({
            conversation:
              conversation._id,
            sender: {
              $ne: userId,
            },
            readBy: {
              $ne: userId,
            },
          });

        return {
          ...conversation.toObject(),
          unreadCount,
        };
      }
    )
  );
};

const getConversationMessages =
  async (
    userId,
    conversationId
  ) => {
    const conversation =
      await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      });

    if (!conversation) {
      const error = new Error(
        "Conversation not found"
      );

      error.statusCode = 404;

      throw error;
    }

    const messages =
      await Message.find({
        conversation:
          conversationId,
      })
        .populate(
          "sender",
          "firstName lastName username avatar role"
        )
        .sort({
          createdAt: 1,
        })
        .limit(200);

    await Message.updateMany(
      {
        conversation:
          conversationId,
        sender: {
          $ne: userId,
        },
        readBy: {
          $ne: userId,
        },
      },
      {
        $addToSet: {
          readBy: userId,
        },
      }
    );

    return {
      conversation,
      messages,
    };
  };

const sendMessage = async (
  userId,
  conversationId,
  data
) => {
  const conversation =
    await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

  if (!conversation) {
    const error = new Error(
      "Conversation not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const text =
    data.text?.trim() || "";

  const attachments =
    data.attachments || [];

  if (
    !text &&
    attachments.length === 0
  ) {
    const error = new Error(
      "Message cannot be empty"
    );

    error.statusCode = 400;

    throw error;
  }

  const message =
    await Message.create({
      conversation:
        conversationId,
      sender: userId,
      text,
      attachments,
      readBy: [userId],
    });

  conversation.lastMessageText =
    text ||
    (attachments.length > 0
      ? "Sent an attachment"
      : "");

  conversation.lastMessageAt =
    new Date();

  await conversation.save();

  return message.populate(
    "sender",
    "firstName lastName username avatar role"
  );
};

const markConversationRead =
  async (
    userId,
    conversationId
  ) => {
    const conversation =
      await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      });

    if (!conversation) {
      const error = new Error(
        "Conversation not found"
      );

      error.statusCode = 404;

      throw error;
    }

    await Message.updateMany(
      {
        conversation:
          conversationId,
        sender: {
          $ne: userId,
        },
      },
      {
        $addToSet: {
          readBy: userId,
        },
      }
    );

    return true;
  };

export {
  getOrCreateConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage,
  markConversationRead,
};