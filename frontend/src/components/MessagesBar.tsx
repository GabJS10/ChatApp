import type { SockeType, user, messages as msg } from "../types/types";
import { useState } from "react";
type Props = {
  socket: SockeType;
  user: user;
  setMessages: (messages: msg[]) => void;
  messages: msg[];
};

const MessagesBar: React.FC<Props> = ({
  socket,
  user,
  setMessages,
  messages,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    socket.emit("message", {
      content: message,
      to: user.userId,
    });
    setMessages([
      ...messages,
      { content: message, fromSelf: true, from: socket.id, to: user.userId },
    ]);
    setMessage("");
  };

  return (
    <>
      <div className="chat-input">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Escribe un mensaje"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </>
  );
};

export default MessagesBar;
