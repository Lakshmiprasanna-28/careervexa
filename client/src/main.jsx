// 📁 client/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Context Providers
import { AuthProvider } from "./context/AuthProvider";
import { ProfileProvider } from "./context/ProfileProvider";
import DarkModeProvider from "./context/DarkModeProvider";
import { NotificationProvider } from "./context/NotificationProvider";
import ChatProvider from "./context/ChatProvider"; // ✅ Import ChatProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <NotificationProvider>
            <DarkModeProvider>
              <ChatProvider> {/* ✅ Wrap App inside ChatProvider */}
                <App />
              </ChatProvider>
            </DarkModeProvider>
          </NotificationProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
