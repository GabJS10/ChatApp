import { Socket } from "socket.io-client";

export type SockeType = Socket<DefaultEventsMap, DefaultEventsMap>;
export interface CustomSocket extends SockeType {
  userId?: string;
}
interface messages {
  content: string;
  fromSelf: boolean;
  from: string | undefined;
  to: string;
}

interface ChatUser {
  [userId: string]: {
    messages: messages[];
  };
}

interface Chat {
  [currentUser: string]: ChatUser;
}

interface user {
  userId: string;
  username: string;
  self: boolean;
  connected: boolean;
  hasNewMessages: boolean;
  messages: messages[];
}

//Users is a list of users
type users = user[];
