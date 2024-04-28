import React from "react";
import io from "socket.io-client";
import ChatMainPage from "./components/ChatMainPage";
import { useState } from "react";

const socket = io("/", {
  autoConnect: false,
});

const App: React.FC = () => {
  const [name, setName] = useState("");
  const [isEntered, setIsEntered] = useState(false);

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

  return (
    <>
      {!isEntered ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
          />
          <button type="submit">Enter</button>
        </form>
      ) : (
        <ChatMainPage socket={socket} name={name} setIsEntered={setIsEntered} />
      )}
    </>
  );
};

export default App;
