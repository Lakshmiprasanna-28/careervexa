// client/src/hooks/useSocket.js
import { useContext } from "react";
import SocketContext from "../context/SocketContext";

export const useSocket = () => {
  return useContext(SocketContext);
};
