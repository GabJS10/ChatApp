import type { users, user } from "../types/types";
type Props = {
  users: users;
  setSelectedUser: (user: user) => void;
};

const Sidebar: React.FC<Props> = ({ users, setSelectedUser }) => {
  const handleClickBtn = (
    e: React.MouseEvent<HTMLButtonElement>,
    user: user
  ) => {
    e.preventDefault();
    user.hasNewMessages = false;
    setSelectedUser(user);
  };

  return (
    <>
      <div className="sidebar">
        <h1>Online</h1>
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
