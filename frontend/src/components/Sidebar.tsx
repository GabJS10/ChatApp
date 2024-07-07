import type { users, user } from "../types/types";
import { CiLogout } from "react-icons/ci";
import { CustomSocket } from "../types/types";

type Props = {
  users: users;
  setSelectedUser: (user: user) => void;
  socket: CustomSocket;
};

const Sidebar: React.FC<Props> = ({ users, setSelectedUser, socket }) => {
  const handleClickBtn = (
    e: React.MouseEvent<HTMLButtonElement>,
    user: user
  ) => {
    e.preventDefault();
    user.hasNewMessages = false;
    setSelectedUser(user);
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    socket.emit("logout", localStorage.getItem("sessionId"));


    localStorage.removeItem("sessionId");
    localStorage.removeItem("username")
    

    window.location.reload()
    
  }

  return (
    <>
      <div className="sidebar">
        <h1>Online</h1>
        <button onClick={handleLogout}><CiLogout /></button>
        <ul className="user-list">
          {users.map((user) => (
            <li
              key={user.userId}
              className={`user-item${
                user.connected ? " connected" : " disconnected"
              }${user.hasNewMessages ? " new-message" : ""}`}
            >
              <button onClick={(e) => handleClickBtn(e, user)}>
                {user.self ? "You" : user.username}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
