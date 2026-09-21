import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import env from "./config/env.js";

import {
  connectDatabase,
  disconnectDatabase,
} from "./config/db.js";

import User from "./models/User.js";
import {
  verifyAccessToken,
} from "./utils/jwt.js";

const startServer = async () => {
  try {
    await connectDatabase();

    const httpServer =
      http.createServer(app);

    const io = new Server(
      httpServer,
      {
        cors: {
          origin: env.clientUrl,
          credentials: true,
        },
      }
    );

    /*
     * Socket authentication
     */
    io.use(
      async (socket, next) => {
        try {
          const token =
            socket.handshake.auth
              ?.token;

          if (!token) {
            return next(
              new Error(
                "Authentication required"
              )
            );
          }

          const payload =
            verifyAccessToken(token);

          if (
            payload.type !==
            "access"
          ) {
            return next(
              new Error(
                "Invalid access token"
              )
            );
          }

          const user =
            await User.findById(
              payload.sub
            ).select(
              "_id firstName lastName username avatar role"
            );

          if (!user) {
            return next(
              new Error(
                "User not found"
              )
            );
          }

          socket.user = user;

          next();
        } catch {
          next(
            new Error(
              "Socket authentication failed"
            )
          );
        }
      }
    );

    io.on(
      "connection",
      (socket) => {
        const userId =
          socket.user._id.toString();

        socket.join(
          `user:${userId}`
        );

        console.log(
          `Socket connected: ${userId}`
        );

        socket.on(
          "conversation:join",
          async (
            conversationId
          ) => {
            try {
              const Conversation =
                (
                  await import(
                    "./models/Conversation.js"
                  )
                ).default;

              const conversation =
                await Conversation.findOne(
                  {
                    _id: conversationId,
                    participants:
                      socket.user._id,
                  }
                );

              if (conversation) {
                socket.join(
                  `conversation:${conversationId}`
                );
              }
            } catch {
              // Ignore invalid room joins
            }
          }
        );

        socket.on(
          "typing",
          ({
            conversationId,
            isTyping,
          }) => {
            socket
              .to(
                `conversation:${conversationId}`
              )
              .emit(
                "typing",
                {
                  userId,
                  isTyping,
                }
              );
          }
        );

        socket.on(
          "disconnect",
          () => {
            console.log(
              `Socket disconnected: ${userId}`
            );
          }
        );
      }
    );

    app.set("io", io);

    httpServer.listen(
      env.port,
      () => {
        console.log("");
        console.log(
          "===================================="
        );
        console.log(
          "       SPORTLINKED BACKEND"
        );
        console.log(
          "===================================="
        );
        console.log(
          `Environment : ${env.nodeEnv}`
        );
        console.log(
          `Server      : http://localhost:${env.port}`
        );
        console.log(
          `API         : http://localhost:${env.port}/api/v1`
        );
        console.log(
          `Health      : http://localhost:${env.port}/api/v1/health`
        );
        console.log(
          "Socket.IO   : enabled"
        );
        console.log(
          "===================================="
        );
        console.log("");
      }
    );

    const shutdown = async (
      signal
    ) => {
      console.log(
        `\n${signal} received. Shutting down...`
      );

      io.close();

      httpServer.close(
        async () => {
          await disconnectDatabase();

          console.log(
            "Server shut down successfully."
          );

          process.exit(0);
        }
      );
    };

    process.on(
      "SIGINT",
      () => shutdown("SIGINT")
    );

    process.on(
      "SIGTERM",
      () => shutdown("SIGTERM")
    );
  } catch (error) {
    console.error(
      "Failed to start SportLinked server:",
      error
    );

    process.exit(1);
  }
};

startServer();