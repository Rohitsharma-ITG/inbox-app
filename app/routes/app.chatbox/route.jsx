// import { useEffect, useState } from "react";
// import { Form, useLocation, useNavigate } from "@remix-run/react";
// import { TextField, Button, Icon } from "@shopify/polaris";
// import { Card } from "@shopify/polaris";
// import { Page } from "@shopify/polaris";
// import { Layout } from "@shopify/polaris";

// export default function Chat() {
//   const [chats, setChats] = useState([]);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, seterror] = useState("");
//   const [editContent, setEditContent] = useState({
//     chatId: "",
//     messageId: "",
//     newMessage: "",
//   });
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userId = location.state;

//   const handleChats = async () => {
//     try {
//       let res;
//       if (userId) {
//         res = await fetch("/api/chats", {
//           method: "POST",
//           body: JSON.stringify({ userId }),
//         });
//       } else {
//         res = await fetch("/api/chats");
//       }
//       const data = await res.json();
//       const chatss = data.chats;
//       if (chatss.length == "0") {
//         navigate("/app/customerlist");
//       }
//       if (chatss.length > "0") {
//         setChats(chatss);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleSend = async () => {
//     seterror("");
//     if (!message.trim()) {
//       seterror("pleace etner message");
//     } else {
//       try {
//         const res = await fetch(`/api/chats`, {
//           method: "PUT",
//           body: JSON.stringify({ message, userId }),
//         });
//         setMessage("");
//         handleChats();
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }
//     }
//   };

//   const handleDeleteMessage = async (chatId, messageId) => {
//     try {
//       const res = await fetch(`/api/edit-message/${chatId}/${messageId}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (data.success) {
//         handleChats();
//       } else {
//         console.error("Error deleting message:", data.message);
//       }
//     } catch (error) {
//       console.error("Error deleting message:", error);
//     }
//   };

//   const handleEdit = async (chatId, messageId, newMessage) => {
//     try {
//       const res = await fetch(`/api/edit-message/${chatId}/${messageId}`, {
//         method: "PUT",
//         body: JSON.stringify({ newMessage }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await res.json();
//       if (data.success) {
//         setEditContent({
//           chatId: "",
//           messageId: "",
//           newMessage: "",
//         });
//         handleChats();
//       } else {
//         console.error("Error updating message:", data.message);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleRefresh = () => {
//     handleChats();
//   };

//   useEffect(() => {
//     handleChats();
//   }, []);

//   if (loading) {
//     return <div>Loading ...</div>;
//   }
//   return (
//     <div>
//       <h1>Chat with Customer</h1>
//       <Page title="Chat Application">
//         <Layout>
//           <Layout.Section>
//             <Card sectioned>
//               <div
//                 style={{
//                   height: "60vh",
//                   overflowY: "auto",
//                   padding: "10px",
//                   backgroundColor: "#ffcbb8",
//                 }}
//               >
//                 {chats.map((chat) => (
//                   <li key={chat._id} style={{ listStyle: "none" }}>
//                     <ul style={{ listStyle: "none" }}>
//                       {chat.messages.map((item) => (
//                         <li
//                           key={item._id}
//                           style={{
//                             maxWidth: "96%",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent:
//                               item.sender == "support" ? "start" : "end",
//                           }}
//                         >
//                           <p
//                             style={{
//                               backgroundColor:
//                                 item.sender === "support"
//                                   ? "#007ace"
//                                   : "#5c5f62",
//                               marginBottom: "8px",
//                               padding: "8px",
//                               borderRadius: "8px",
//                               color: "white",
//                             }}
//                           >
//                             {item.message}
//                           </p>
//                           {item.sender === "customer" && (
//                             <>
//                               <Button
//                                 onClick={() =>
//                                   handleDeleteMessage(chat._id, item._id)
//                                 }
//                                 style={{ fontSize: "16px", padding: "0" }}
//                               >
//                                 {" "}
//                                 <span
//                                   style={{ fontSize: "16px", padding: "0px" }}
//                                 >
//                                   🗑️
//                                 </span>{" "}
//                               </Button>
//                               <Button
//                                 onClick={() =>
//                                   setEditContent({
//                                     ...editContent,
//                                     chatId: chat._id,
//                                     messageId: item._id,
//                                     newMessage: item.message,
//                                   })
//                                 }
//                               >
//                                 Edit
//                               </Button>
//                             </>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   </li>
//                 ))}
//               </div>
//             </Card>
//           </Layout.Section>
//           <Layout.Section>
//             <Card sectioned>
//               <div
//                 style={{ display: "flex", gap: "10px", alignItems: "center" }}
//               >
//                 {editContent.chatId ? (
//                   <>
//                     <TextField
//                       label="Enter your message"
//                       value={editContent.newMessage}
//                       onChange={(value) =>
//                         setEditContent({ ...editContent, newMessage: value })
//                       }
//                       fullWidth
//                     />
//                     <Button
//                       primary
//                       onClick={() =>
//                         handleEdit(
//                           editContent.chatId,
//                           editContent.messageId,
//                           editContent.newMessage,
//                         )
//                       }
//                     >
//                       edit
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     {" "}
//                     <TextField
//                       label="Enter your message"
//                       value={message}
//                       onChange={(value) => setMessage(value)}
//                       fullWidth
//                     />
//                     <Button primary onClick={handleSend}>
//                       Send
//                     </Button>
//                   </>
//                 )}

//                 <Button onClick={handleRefresh}>Refresh</Button>
//               </div>
//             </Card>
//           </Layout.Section>
//         </Layout>
//       </Page>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useLocation,useNavigate } from "@remix-run/react";
import { TextField, Button, Card, Page, Layout,Spinner } from "@shopify/polaris";
import { io } from "socket.io-client";
import { set } from "mongoose";

const socket = io("https://7d4a-49-249-2-6.ngrok-free.app", {
  transports: ["websocket"],
  secure: true,
});

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const [role, setrole] = useState("support");
  const navigate = useNavigate();
  useEffect(() => {
    const userIds = location.state;
    if (userIds) {
      setUserId(userIds);
    } else {
      handleChats();
    }
  }, [location.state]);

  useEffect(() => {
    if (userId) {
      handleChats();
      socket.emit("joinChat", userId);
    } 
    socket.on("newMessage", (newChat) => {
      console.log("newChat", newChat);
      setChats(newChat);
    });

    return () => {
      socket.off("newMessage");
    };
} , [userId]);

const handleChats = async () => {
    try {
      let res;
      if (userId) {
        res = await fetch("/api/chats", {
          method: "POST",
          body: JSON.stringify({ userId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        res = await fetch("/api/chats");
      }
      const data = await res.json();
      if (data.message == "user role is support") {
        navigate("/app/customerlist");
      }
      setChats(data.chats);
      setLoading(false);
      if (data.userId) {
        setUserId(data.userId);
        setrole(data.role);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSend = async () => {
    setError("");
    if (!message.trim()) {
      setError("Please enter a message");
    } else {
      socket.emit("sendMessage", { userId, message, role });
      setMessage("");
    }
  };

  if (loading) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Spinner accessibilityLabel="Loading user list" size="large" />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  return (
    <Page title="Chat with Customer">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <div
              style={{
                height: "60vh",
                overflowY: "auto",
                padding: "10px",
                backgroundColor: "#ffcbb8",
              }}
            >
              {chats &&
                chats.map((chat, index) => (
                  <li key={index} style={{ listStyle: "none" }}>
                    <ul style={{ listStyle: "none" }}>
                      {chat.messages.map((item, msgIndex) => (
                        <li
                          key={msgIndex}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              item.sender === "support" ? "start" : "end",
                          }}
                        >
                          <p
                            style={{
                              backgroundColor:
                                item.sender === "support"
                                  ? "#007ace"
                                  : "#5c5f62",
                              marginBottom: "8px",
                              padding: "8px",
                              borderRadius: "8px",
                              color: "white",
                            }}
                          >
                            {item.message}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </div>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <TextField
                label="Enter your message"
                value={message}
                onChange={(value) => setMessage(value)}
                fullWidth
              />
              <Button primary onClick={handleSend}>
                Send
              </Button>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
