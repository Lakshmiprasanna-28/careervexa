import { useState, useEffect, useCallback } from "react";
import { getThreads } from "@/api/MessageApi";
import { useChat } from "../context/useChat";

export function useThreads() {
  const [loading, setLoading] = useState(true);
  const { user, setThreads } = useChat();

  const fetchThreads = useCallback(async () => {
    if (!user?.id || !user?.token) return;
    setLoading(true);
    try {
      const res = await getThreads(user.id, user.token);
      setThreads(res);
    } catch (err) {
      console.error("❌ Failed to fetch threads", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.token, setThreads]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return { loading, fetchThreads };
}
