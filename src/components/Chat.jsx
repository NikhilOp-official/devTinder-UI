import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages?.map((message) => {
        return {
          firstName: message?.senderId?.firstName,
          lastName: message?.senderId?.lastName,
          text: message?.text,
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error getting chat messages");
    }
  };
  console.log("xnjnc", messages);
  useEffect(() => {
    fetchChatMessages();
  }, []);
  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      console.log(firstName + " :" + text);
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-2xl h-[85vh] sm:h-[75vh] bg-base-100 rounded-2xl shadow-xl overflow-hidden flex flex-col border border-base-300">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-base-300 flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content w-10 rounded-full">
              <span className="text-lg">👨</span>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="font-bold text-lg">Chat</h1>
            <p className="text-xs text-success">● Online</p>
          </div>

          <button className="btn btn-ghost btn-circle">⋮</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat ${
                message.firstName === user?.firstName
                  ? "chat-end"
                  : "chat-start"
              }`}
            >
              <div className="chat-header text-xs opacity-60 mb-1">
                {message.firstName + " " + message.lastName}
                <time className="ml-2">2 hours ago</time>
              </div>

              <div
                className={`chat-bubble ${
                  message.sender === "me" ? "chat-bubble-primary" : ""
                }`}
              >
                {message.text}
              </div>

              <div className="chat-footer opacity-50 text-xs mt-1">
                {message.sender === "me" ? "Seen" : "Delivered"}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-base-300 bg-base-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type a message..."
              className="input input-bordered flex-1 rounded-full focus:outline-none focus:border-primary"
            />

            <button
              onClick={sendMessage}
              className="btn btn-primary btn-circle sm:btn-wide"
            >
              <span className="hidden sm:inline">Send</span>
              <span className="sm:hidden">➤</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
