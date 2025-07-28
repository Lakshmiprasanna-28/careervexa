// 📁 client/src/components/messages/MessageBubble.jsx
import React, { memo } from "react";
import { useChat } from "../../context/useChat.jsx";
import dayjs from "dayjs";

function MessageBubbleComponent({ message }) {
  const { user } = useChat();
  const currentUserId = user?._id || user?.id || null;

  const senderId =
    (message.senderId && message.senderId._id) ||
    message.senderId ||
    (message.sender && message.sender._id) ||
    message.sender;

  const isMine = currentUserId && senderId?.toString() === currentUserId.toString();

  const renderTicks = () => {
    if (!isMine) return null;
    if (message.isRead) return <span className="text-blue-500 ml-1">✅✅</span>;
    if (message.isDelivered) return <span className="text-gray-400 ml-1">✅✅</span>;
    return <span className="text-gray-400 ml-1">✅</span>;
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} my-2 px-3`}>
      <div
        className={`relative rounded-2xl p-3 max-w-xs sm:max-w-sm md:max-w-md break-words shadow-md transition ${
          isMine
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none"
        }`}
      >
        {(message.text || message.content) && (
          <div className="text-sm sm:text-base">
            {message.text || message.content}
          </div>
        )}

        {message.media && (
          <div className="mt-2">
            {/\.(mp4|webm|ogg)$/i.test(message.media) ? (
              <video
                src={message.media}
                controls
                className="max-w-[200px] md:max-w-[250px] rounded-lg shadow"
              />
            ) : (
              <img
                src={message.media}
                alt="media"
                className="max-w-[200px] md:max-w-[250px] rounded-lg shadow"
              />
            )}
          </div>
        )}

        <div
          className={`text-[10px] opacity-70 mt-1 flex justify-end items-center ${
            isMine ? "text-right" : "text-left"
          }`}
        >
          {dayjs(message.createdAt).format("HH:mm")}
          {renderTicks()}
        </div>
      </div>
    </div>
  );
}

const MessageBubble = memo(
  MessageBubbleComponent,
  (prev, next) =>
    prev.message._id === next.message._id &&
    prev.message.updatedAt === next.message.updatedAt &&
    prev.message.isDelivered === next.message.isDelivered &&
    prev.message.isRead === next.message.isRead
);

export default MessageBubble;
