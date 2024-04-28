import type { SockeType } from "../types/types";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import type { users, user, messages as msg } from "../types/types";

type Props = {
  socket: SockeType;
  name: string;
  setIsEntered: (isEntered: boolean) => void;
};

const initUsers: users = [];
const ChatMainPage: React.FC<Props> = ({ socket, name, setIsEntered }) => {
  const [users, setUsers] = useState(initUsers);
  const [selectedUser, setSelectedUser] = useState<user | null>(null);
  const [messages, setMessages] = useState<msg[]>([]);

  socket.auth = { username: name };
  socket.connect();

  socket.on("connect_error", (err) => {
    console.log(err.message);

    if (err.message === "invalid username") {
      setIsEntered(false);
    }
  });

  socket.on("users", (users: users): void => {
    users.forEach((user) => {
      user.self = user.userId === socket.id;
      user.connected = true;
    });
    const u = users.sort((a, b) => {
      if (a.self) return -1;
      if (b.self) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });

    setUsers(u);
  });

  socket.on("user connected", (user: user): void => {
    user.self = user.userId === socket.id;
    user.connected = true;
    setUsers([...users, user]);
  });

  socket.on("user disconnected", (u: user): void => {
    const us = [...users];
    for (let i = 0; i < us.length; i++) {
      const user = users[i];
      if (user.userId === u.userId) {
        user.connected = false;
        break;
      }
    }
    setUsers(us);
  });

  socket.on("message_response", (message: msg): void => {
    const us = users;

    for (let i = 0; i < us.length; i++) {
      const user = us[i];
      if (user.userId === message.from) {
        user.hasNewMessages = true;

        if (selectedUser?.userId === message.from) {
          user.hasNewMessages = false;
        }

        break;
      }
    }

    setUsers(us);
    setMessages([...messages, message]);
  });

  socket.on("connect", (): void => {
    const us = users;
    us.forEach((user) => {
      if (user.self) {
        user.connected = true;
      }
    });

    setUsers(us);
  });

  socket.on("disconnect", (): void => {
    const us = users;
    us.forEach((user) => {
      if (user.self) {
        user.connected = false;
      }
    });
    setUsers(us);
  });

  //component did unmount
  useEffect(() => {
    return () => {
      socket.off("connect_error");
    };
  });

  return (
    <>
      <div className="container">
        <Sidebar users={users} setSelectedUser={setSelectedUser} />
        {selectedUser && (
          <Chat
            socket={socket}
            user={selectedUser}
            users={users}
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </div>
    </>
  );
};

export default ChatMainPage;
