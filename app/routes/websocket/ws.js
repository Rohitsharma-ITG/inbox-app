// import { createServer } from "http";
// import { WebSocketServer } from "ws";
// import mongoose from "mongoose";
// import { Chat } from "../../models/chats.model.js"; // Chat Model

// const server = createServer();
// const wss = new WebSocketServer({ server });

// const clients = new Map(); // { userId: socket }

// wss.on("connection", async (ws, req) => {
//   const userId = req.headers["sec-websocket-protocol"]; // Client se ID milegi
//   if (!userId) return ws.close();
  
//   clients.set(userId, ws);

//   ws.on("message", async (message) => {
//     const data = JSON.parse(message);
//     const { sender, receiver, text } = data;

//     // Save message in MongoDB
//     const chatMessage = new Chat({
//       customerId: sender,
//       messages: { sender, message: text },
//     });
//     await chatMessage.save();

//     // Send to receiver if online
//     if (clients.has(receiver)) {
//       clients.get(receiver).send(JSON.stringify({ sender, text }));
//     }
//   });

//   ws.on("close", () => {
//     clients.delete(userId);
//   });
// });

// server.listen(8080, () => console.log("WebSocket running on port 8080"));
