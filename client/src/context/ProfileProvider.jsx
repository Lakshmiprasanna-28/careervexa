import { useState } from "react";
import { ProfileContext } from "./ProfileContext";

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null); // Add more fields if needed later

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
