import {
  getOrCreateConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage,
  markConversationRead,
} from "../services/message.service.js";

export const createConversation =
  async (req, res) => {
    const conversation =
      await getOrCreateConversation(
        req.user._id,
        req.body.recipientId
      );

    res.status(201).json({
      success: true,
      data: {
        conversation,
      },
    });
  };

export const mine =
  async (req, res) => {
    const conversations =
      await getMyConversations(
        req.user._id
      );

    res.json({
      success: true,
      data: {
        conversations,
      },
    });
  };

export const messages =
  async (req, res) => {
    const result =
      await getConversationMessages(
        req.user._id,
        req.params.id
      );

    res.json({
      success: true,
      data: result,
    });
  };

export const send =
  async (req, res) => {
    const message =
      await sendMessage(
        req.user._id,
        req.params.id,
        req.body
      );

    const io = req.app.get("io");

    if (io) {
      io.to(
        `conversation:${req.params.id}`
      ).emit(
        "message:new",
        message
      );

      const conversation =
        await message.populate({
          path: "conversation",
        });

      if (conversation?.conversation) {
        conversation.conversation.participants.forEach(
          (participantId) => {
            io.to(
              `user:${participantId.toString()}`
            ).emit(
              "conversation:updated",
              {
                conversationId:
                  req.params.id,
              }
            );
          }
        );
      }
    }

    res.status(201).json({
      success: true,
      data: {
        message,
      },
    });
  };

export const read =
  async (req, res) => {
    await markConversationRead(
      req.user._id,
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Conversation marked as read",
    });
  };