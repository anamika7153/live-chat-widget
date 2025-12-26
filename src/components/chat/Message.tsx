import { Message as MessageType } from '../../types/chat.types';
import { cn } from '../../utils/cn';

interface MessageProps {
  message: MessageType;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex mb-4 animate-slide-up',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mr-2">
          <span className="text-xs font-medium text-gray-600">AI</span>
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] px-4 py-3 shadow-sm',
          isUser
            ? 'bg-blue-500 text-white rounded-2xl rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <div className="flex items-center justify-end gap-2 mt-1">
          {message.status === 'pending' && isUser && (
            <span className="text-xs opacity-70">Sending...</span>
          )}
          {message.status === 'error' && isUser && (
            <span className="text-xs text-red-200">Failed</span>
          )}
          <time
            className={cn(
              'text-xs',
              isUser ? 'text-blue-100' : 'text-gray-400'
            )}
            dateTime={message.timestamp.toISOString()}
          >
            {formatTime(message.timestamp)}
          </time>
        </div>
      </div>
    </div>
  );
}
