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
// const [editContent, setEditContent] = useState({
//   chatId: "",
//   messageId: "",
//   newMessage: "",
// });
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

// const handleDeleteMessage = async (chatId, messageId) => {
//   try {
//     const res = await fetch(`/api/edit-message/${chatId}/${messageId}`, {
//       method: "DELETE",
//     });
//     const data = await res.json();
//     if (data.success) {
//       handleChats();
//     } else {
//       console.error("Error deleting message:", data.message);
//     }
//   } catch (error) {
//     console.error("Error deleting message:", error);
//   }
// };

// const handleEdit = async (chatId, messageId, newMessage) => {
//   try {
//     const res = await fetch(`/api/edit-message/${chatId}/${messageId}`, {
//       method: "PUT",
//       body: JSON.stringify({ newMessage }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await res.json();
//     if (data.success) {
//       setEditContent({
//         chatId: "",
//         messageId: "",
//         newMessage: "",
//       });
//       handleChats();
//     } else {
//       console.error("Error updating message:", data.message);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

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
// <Card sectioned>
//   <div
//     style={{
//       height: "60vh",
//       overflowY: "auto",
//       padding: "10px",
//       backgroundColor: "#ffcbb8",
//     }}
//   >
//     {chats.map((chat) => (
//       <li key={chat._id} style={{ listStyle: "none" }}>
//         <ul style={{ listStyle: "none" }}>
//           {chat.messages.map((item) => (
//             <li
//               key={item._id}
//               style={{
//                 maxWidth: "96%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent:
//                   item.sender == "support" ? "start" : "end",
//               }}
//             >
//               <p
//                 style={{
//                   backgroundColor:
//                     item.sender === "support"
//                       ? "#007ace"
//                       : "#5c5f62",
//                   marginBottom: "8px",
//                   padding: "8px",
//                   borderRadius: "8px",
//                   color: "white",
//                 }}
//               >
//                 {item.message}
//               </p>
//               {item.sender === "customer" && (
//                 <>
//                   <Button
//                     onClick={() =>
//                       handleDeleteMessage(chat._id, item._id)
//                     }
//                     style={{ fontSize: "16px", padding: "0" }}
//                   >
//                     {" "}
//                     <span
//                       style={{ fontSize: "16px", padding: "0px" }}
//                     >
//                       🗑️
//                     </span>{" "}
//                   </Button>
//                   <Button
//                     onClick={() =>
//                       setEditContent({
//                         ...editContent,
//                         chatId: chat._id,
//                         messageId: item._id,
//                         newMessage: item.message,
//                       })
//                     }
//                   >
//                     Edit
//                   </Button>
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       </li>
//     ))}
//   </div>
// </Card>
//           </Layout.Section>
//           <Layout.Section>
//             <Card sectioned>
//               <div
//                 style={{ display: "flex", gap: "10px", alignItems: "center" }}
//               >
// {editContent.chatId ? (
//   <>
//     <TextField
//       label="Enter your message"
//       value={editContent.newMessage}
//       onChange={(value) =>
//         setEditContent({ ...editContent, newMessage: value })
//       }
//       fullWidth
//     />
//     <Button
//       primary
//       onClick={() =>
//         handleEdit(
//           editContent.chatId,
//           editContent.messageId,
//           editContent.newMessage,
//         )
//       }
//     >
//       edit
//     </Button>
//   </>
// ) : (
//   <>
//     {" "}
//     <TextField
//       label="Enter your message"
//       value={message}
//       onChange={(value) => setMessage(value)}
//       fullWidth
//     />
//     <Button primary onClick={handleSend}>
//       Send
//     </Button>
//   </>
// )}

//                 <Button onClick={handleRefresh}>Refresh</Button>
//               </div>
//             </Card>
//           </Layout.Section>
//         </Layout>
//       </Page>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import {
  TextField,
  Button,
  Card,
  Page,
  Layout,
  Spinner,
} from "@shopify/polaris";
import "./chatboc.css";
import { io } from "socket.io-client";
import { set } from "mongoose";

const socket = io("https://801e-49-249-2-6.ngrok-free.app", {
  transports: ["websocket"],
  secure: true,
});

export default function Chat() {  
  const [chats, setChats] = useState([]);
  const fileInputRef = useRef(null);
  const [btnEnable, setbtnEnable] = useState(null);
  const [message, setMessage] = useState(null);
  const [file, setFile] = useState(null);
  const [activeUserId, setactiveUserId] = useState("67b6f7dce0411ec61f6c9679");
  const [loading, setLoading] = useState(true);
  const [typingMessage, setTypingMessage] = useState("");
  const location = useLocation();
  const [username, setusername] = useState('')
  const [userId, setUserId] = useState("");
  const [role, setrole] = useState("support");
  const [useronline, setuseronline] = useState("offline")
  const [onlineuserId, setonlineuserId] = useState('')
  const [editContent, setEditContent] = useState({
    chatId: "",
    messageId: "",
    newMessage: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    const userinfo = location.state;
    if (userinfo) {
      if (userinfo.userId) {
        setUserId(userinfo.userId);
        setusername(userinfo.name)
      }
    } else {
        handleChats();
    }

  }, [location.state]);

  useEffect(() => {
    if (userId) {
      handleChats();
      socket.emit("joinChat", {userId,activeUserId});
    }
    socket.on("newMessage", (newChat) => {
      console.log("newChat", newChat);
      setChats(newChat);
    });

    socket.on("chagedChat", (userId) => {
      handleChats();
    });
     
    socket.on("customerOnline", ({ activeUserId, name , status }) => {
      setuseronline(status)
      setonlineuserId(activeUserId)
    });

    socket.on("customerOffline", ({ activeUserId, name , status }) => {
      setuseronline(status)
    });


    socket.on("userTyping", ({ userId, role }) => {
      setTypingMessage(` is typing...`);
      setTimeout(() => setTypingMessage(""), 2000);
    });

    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
      socket.off("chagedChat");
      socket.off("supportOnline");
      socket.off("supportOffline");
    };
  }, [userId]);

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
      setactiveUserId("67b6f7dce0411ec61f6c9679");
      setLoading(false);
      if (data.userId) {
        setUserId(data.userId);
        setactiveUserId(data.userId);
        setrole(data.role);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSend = async () => {
    let fileUrl = "";
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "new_preset");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dxikxulhf/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      fileUrl = data.secure_url;
    }

    socket.emit("sendMessage", { userId, message, file: fileUrl, role });

    setMessage("");
    setFile("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTyping = () => {
    socket.emit("typing2", { userId, role });
  };

  const handleDeleteMessage = async (chatId, messageId) => {
    try {
      const res = await fetch(`/api/edit-message/${chatId}/${messageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        socket.emit("chatupdate", userId);
      } else {
        console.error("Error deleting message:", data.message);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleEdit = async (chatId, messageId, newMessage) => {
    try {
      const res = await fetch(`/api/edit-message/${chatId}/${messageId}`, {
        method: "PUT",
        body: JSON.stringify({ newMessage }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        setEditContent({
          chatId: "",
          messageId: "",
          newMessage: "",
        });
        setMessage("");
        // handleChats();
        socket.emit("chatupdate", userId);
        setbtnEnable(null);
      } else {
        console.error("Error updating message:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
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
  console.log("-------",onlineuserId,"-----")
  return (
    <Page title={`Chat with ${username}`} >
    {
      (useronline == "online" && onlineuserId == chats[0].customerId) ? <p style={{fontSize:"17px",color:"green"}}>Online</p> : <p style={{fontSize:"17px",color:"red"}}>Offline</p>
    }
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
                chats.map((chat) => (
                  <li key={chat._id} style={{ listStyle: "none" }}>
                    <ul style={{ listStyle: "none" }}>
                      {chat.messages.map((item) => (
                        <li
                          key={item._id}
                          style={{
                            maxWidth: "96%",
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent:
                              item.sender == "support" ? "start" : "end",
                            flexWrap: "wrap",
                            position: "relative",
                          }}
                        >
                          {" "}
                          {item.sender === "support" && (
                            <div
                              className="click-btns"
                              onClick={() => setbtnEnable(item._id)}
                            >
                              <p>.</p>
                              <p>.</p>
                              <p>.</p>
                            </div>
                          )}
                          {item.file && (
                            <div
                              style={{
                                width: "95%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                  item.sender == "support" ? "start" : "end",
                              }}
                            >
                              <img
                                src={item.file}
                                alt="image"
                                style={{ width: "100px" }}
                              />
                            </div>
                          )}
                          {item.message && (
                            <>
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
                            </>
                          )}
                          {btnEnable === item._id && (
                            <div className="edit-buttons">
                              {item.message && (
                                <p
                                  onClick={() =>
                                    setEditContent({
                                      ...editContent,
                                      chatId: chat._id,
                                      messageId: item._id,
                                      newMessage: item.message,
                                    })
                                  }
                                  className="edit-btn"
                                >
                                  Edit
                                </p>
                              )}
                              <p
                                onClick={() =>
                                  handleDeleteMessage(chat._id, item._id)
                                }
                                className="delete-btn"
                              >
                                Delete
                              </p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </div>
            {typingMessage && (
              <p style={{ padding: "10px", fontStyle: "italic" }}>
                {typingMessage}
              </p>
            )}
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            {editContent.chatId ? (
              <>
                <TextField
                  label="Enter your message"
                  value={editContent.newMessage}
                  onChange={(value) =>
                    setEditContent({ ...editContent, newMessage: value })
                  }
                  fullWidth
                />
                <Button
                  primary
                  onClick={() =>
                    handleEdit(
                      editContent.chatId,
                      editContent.messageId,
                      editContent.newMessage,
                    )
                  }
                >
                  edit
                </Button>
              </>
            ) : (
              <>
                <TextField
                  label="Enter your message"
                  value={message}
                  onChange={(value) => {
                    setMessage(value);
                    handleTyping();
                  }}
                  fullWidth
                />
                <input
                  type="file"
                  name="image"
                  ref={fileInputRef}
                  onChange={(value) => {
                    setFile(value.target.files[0]);
                  }}
                />
                {file && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="image"
                    style={{ width: "100px" }}
                  />
                )}
                <Button primary onClick={handleSend}>
                  Send
                </Button>
              </>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
