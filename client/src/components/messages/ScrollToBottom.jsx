// 📁 client/src/components/messages/ScrollToBottom.jsx
import { useEffect } from "react";

export default function ScrollToBottom({ containerRef }) {
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef]); // ✅ Added containerRef as a dependency

  return null;
}
