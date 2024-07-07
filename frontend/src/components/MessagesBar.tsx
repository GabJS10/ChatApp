import type { SockeType, CustomSocket,user, messages as msg } from "../types/types";
import { useState } from "react";
import imgReader from "../helpers/imgReader";
type Props = {
  socket: CustomSocket;
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
  const [files, setFiles] = useState<string | ArrayBuffer | null>(null);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    socket.emit("message", {
      content: message,
      to: user.userId,
      files
    });

    setMessages([
      ...messages,
      { content: message, fromSelf: true, from: socket.userId, to: user.userId, files, img:imgReader(files) },
    ]);
    setMessage("");
    //reset files
    setFiles(null);
    event.currentTarget.reset();
    
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const fls = event.target.files;
    if (fls && fls.length > 0) {
      const fr = new FileReader() 
      fr.onload = () => {
        setFiles(fr.result)

      }
      fr.readAsArrayBuffer(fls[0])
    }

    
    

  }

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
      <input type="file" id="file-input" onChange={handleChange} accept="image/*"/>
      <label htmlFor="file-input">{files ? "Imagen lista" : "Seleccionar imagen"}</label>
      <button type="submit">Enviar</button>
    </form>
  </div>
</>
  );
};

export default MessagesBar;
