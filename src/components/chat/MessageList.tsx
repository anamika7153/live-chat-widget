import { useRef, useEffect } from 'react';
import { Message as MessageType } from '../../types/chat.types';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
}

export default function MessageList({ messages, isTyping }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 chat-scrollbar"
      role="log"
      aria-label="Chat messages"
    >
      {messages.length === 0 && !isTyping && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👋</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Welcome to ShopEase Support!
          </h3>
          <p className="text-gray-500 text-sm">
            Ask me anything about orders, shipping, returns, or our products.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      <TypingIndicator isVisible={isTyping} />

      <div ref={endRef} aria-hidden="true" />
    </div>
  );
}
