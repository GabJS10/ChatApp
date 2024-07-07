import React from "react";
import io from "socket.io-client";
import ChatMainPage from "./components/ChatMainPage";
import { useState } from "react";
import { SockeType, CustomSocket } from "./types/types";

const socket: CustomSocket = io("/", {
  autoConnect: false,
});

const App: React.FC = () => {
  const [name, setName] = useState(localStorage.getItem("username") || "");
  const [isEntered, setIsEntered] = useState(
    localStorage.getItem("username") ? true : false
  );

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setName(event.target.value.trim());
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    //no count if name is empty
    if (name) {
      setIsEntered(true);
    }
  };

  socket.on(
    "session",
    ({
      userId,
      sessionId,
      username,
    }: {
      userId: string;
      sessionId: string;
      username: string;
    }) => {
      socket.auth = { sessionId };
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("username", username);
      socket.userId = userId;
    }
  );

  return (
    <>
  {!isEntered ? (
    <div className="enter-page">
      <form className="enter-form" onSubmit={handleSubmit}>
        <h2>Bienvenido a ChatExpress</h2>
        <input
          type="text"
          placeholder="Ingrese su nombre"
          value={name}
          onChange={handleNameChange}
        />
        <button type="submit">Entrar</button>
        <p>Recuerda que una vez cierres la sesion, tu chat se borrara</p>
      </form>
    </div>
  ) : (
    <ChatMainPage socket={socket} name={name} setIsEntered={setIsEntered} />
  )}
</>

  );
};

export default App;
