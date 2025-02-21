// import { Chat } from "../../models/chats.model";
// import { User } from "../../models/user.model";
// import { authenticate } from "../../shopify.server";

// export const loader = async ({ request }) => {
//   const { session } = await authenticate.admin(request);
//   const shop = session.shop;
//   if (!shop) {
//     return Response.json({ message: "shop is not found", status: 400 });
//   }
//   let user = await User.findOne({ email: shop });
//   if (!user) {
//     return Response.json({ message: "user is not found", status: 404 });
//   }
//   const customerId = user._id;

//   try {
//     const chats = await Chat.find({ customerId });
//     console.log('chats',chats);
//     if (!chats) {
//       return Response.json({ message: "No chats found", status: 404  });
//     }
//     return Response.json({ chats , status : 200 });
//   } catch (error) {
//     console.error(error);
//     return new Response(
//       JSON.stringify({ message: "Error fetching chats", error: error.message }),
//       { status: 500 },
//     );
//   }
// };



// export const action = async ({ request }) => {

//      if (request.method == "POST") {
//       const {userId} = await request.json();
//       console.log('userid--',userId);
//       const customerId = userId;
//       try {
//         const chats = await Chat.find({ customerId });
//         console.log('chats',chats);
//         if (!chats) {
//           return Response.json({ message: "No chats found", status: 404  });
//         }
//         return Response.json({ chats , status : 200 });
//       } catch (error) {
//         console.error(error);
//         return new Response(
//           JSON.stringify({ message: "Error fetching chats", error: error.message }),
//           { status: 500 },
//         );
//       }
//      }  else{
//       const { session } = await authenticate.admin(request);
//       const shop = session.shop;
//       if (!shop) {
//         return Response.json({ message: "shop is not found", status: 400 });
//       }
//       let users = await User.findOne({ email: shop });
//       if (!users) {
//         return Response.json({ message: "user is not found", status: 404 });
//       }
//       let userId ;
//       const body = await request.json();
//       if (body.userId) {
//         userId = body.userId
//       } else {
//         userId = users._id
//       }

//     if (request.method === "PUT") {
//       try {
//         const user = await User.findById(userId);
//         if (!user) {
//           return Response.json({ error: "User not found" }, { status: 404 });
//         }
  
//         let chat = await Chat.findOne({ customerId: userId });
  
//         if (chat) {
//           chat.messages.push({
//             sender: users.role,
//             message: body.message,
//           });
  
//           await chat.save();
//           return Response.json({
//             message: "Message added to existing chat",
//             chat,
//           });
//         } else {
//           chat = new Chat({
//             customerId: userId,
  
//             messages: [
//               {
//                 sender: user.role,
//                 // sender: body.role,
//                 message: body.message,
//               },
//             ],
//           });
  
//           await chat.save();
//           return Response.json({ message: "New chat created", chat });
//         }
//       } catch (error) {
//         console.error("Error in action:", error);
//         return Response.json(
//           { error: "Failed to process chat" },
//           { status: 500 },
//         );
//       }
//     } else {
//       return Response.json({ error: "Invalid method" }, { status: 405 });
//     }
//      }

// };


import { Chat } from "../../models/chats.model";
import { User } from "../../models/user.model";
import { authenticate } from "../../shopify.server";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";



export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  if (!shop) {
    return Response.json({ message: "shop is not found", status: 400 });
  }
  let user = await User.findOne({ email: shop });
  if (!user) {
    return Response.json({ message: "user is not found", status: 404 });
  }
  if (user.role == "support") {
    return Response.json({ message: "user role is support", status: 403 });
  }
  const customerId = user._id;

  try {
    const chats = await Chat.find({ customerId });
    console.log('chats',chats);
    if (!chats) {
      return Response.json({ message: "No chats found", status: 404  });
    }
    return Response.json({ chats , status : 200 ,userId:customerId,role:user.role});
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Error fetching chats", error: error.message }),
      { status: 500 },
    );
  }
};



export const action = async ({ request }) => {

     if (request.method == "POST") {
      const {userId} = await request.json();
      const customerId = userId;
      try {
        const chats = await Chat.find({ customerId });
        if (!chats) {
          return Response.json({ message: "No chats found", status: 404  });
        }
        return Response.json({ chats , status : 200 });
      } catch (error) {
        console.error(error);
        return new Response(
          JSON.stringify({ message: "Error fetching chats", error: error.message }),
          { status: 500 },
        );
      }
     }  
}


const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

const onlineUsers = new Map();
io.on("connection", (socket) => {
  socket.on("joinChat", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} joined`);
  });
  socket.on("sendMessage", async ({ userId, message,role }) => {
    console.log('message',message);
    try {
      let user = await User.findById(userId);
      if (!user) {
        return;
      }
      let chat = await Chat.findOne({ customerId: userId });
      if (chat) {
        chat.messages.push({
          sender: role,
          message,
        });
      } else {
        chat = new Chat({
          customerId: userId,
          messages: [{ sender: role, message }],
        });
      }

      await chat.save();
      const dataa = [chat]
      io.emit("newMessage", dataa);
      console.log(`New message from support to ${userId}: ${message}`);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    });
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
