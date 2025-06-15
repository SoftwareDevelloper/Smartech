import React, { useState } from 'react';
import send from '../assest/send.png';
const ChatForm = ({ onChatSubmit }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onChatSubmit(message);
      setMessage("");
    }
  };

  return (
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          className="message-input"
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">
          <img src={send} alt="" width="28px" height="28px" />
        </button>
      </form>
  );
};

export default ChatForm;
