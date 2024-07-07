import type { SockeType, CustomSocket, user, messages as msg, users } from "../types/types";
import MessagesBar from "./MessagesBar";
type Props = {
  socket: CustomSocket;
  user: user;
  users: users;
  messages: msg[];
  setMessages: (messages: msg[]) => void;
};
const Chat: React.FC<Props> = ({ socket, user, messages, setMessages }) => {
  const m = messages.filter(
    (message) =>
      (message.to === socket.userId && message.from === user.userId) ||
      (message.to === user.userId && message.from === socket.userId)
  );
  
  return (
    <>
  <div className="chat">
    <div className="chat-header">
      <h2>Chat con {user.username}</h2>
    </div>
    <div className="chat-messages">
      {m.length > 0 ? (
        m.map((message, index) => (
          <div
            className={`chat-message ${message.fromSelf ? "self" : "other"}`}
            key={index}
          >
            <div className="message-container">
              {message.img && (
                <img src={message.img} alt="message-img" />
              )}
              <div className="message-text">{message.content}</div>
            </div>
          </div>
        ))
      ) : (
        <p>No hay mensajes</p>
      )}
    </div>
    <MessagesBar
      socket={socket}
      user={user}
      setMessages={setMessages}
      messages={messages}
    />
  </div>
</>

  );
};

export default Chat;
