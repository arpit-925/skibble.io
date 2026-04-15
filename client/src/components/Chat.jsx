import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";

export default function Chat({ roomId, messages, disabled, isDrawer }) {
  const [text, setText] = useState("");
  const messageListRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (!messageList || !shouldStickToBottomRef.current) return;

    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  const handleScroll = () => {
    const messageList = messageListRef.current;
    if (!messageList) return;

    const distanceFromBottom = messageList.scrollHeight - messageList.scrollTop - messageList.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom < 24;
  };

  const send = (event) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    socket.emit(isDrawer ? "chat" : "guess", { roomId, text: value });
    setText("");
  };

  return (
    <section className="panel chat-panel">
      <div className="panel-header">
        <h2>Chat</h2>
        <span>{isDrawer ? "Talk" : "Guess"}</span>
      </div>

      <div ref={messageListRef} className="message-list" onScroll={handleScroll}>
        {messages.map((message, index) => (
          <p key={`${message.id || index}-${index}`} className={`message ${message.type || "chat"}`}>
            {message.playerName ? <strong>{message.playerName}: </strong> : null}
            {message.text}
          </p>
        ))}
      </div>

      <form className="chat-form" onSubmit={send}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={isDrawer ? "Send a hint in chat" : "Type your guess"}
          disabled={disabled}
          maxLength={80}
        />
        <button disabled={disabled || !text.trim()}>Send</button>
      </form>
    </section>
  );
}
