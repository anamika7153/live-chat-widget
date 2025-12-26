interface TypingIndicatorProps {
  isVisible: boolean;
}

export default function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="flex items-start gap-2 mb-4" role="status" aria-live="polite">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
        <span className="text-xs">AI</span>
      </div>
      <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-md">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot" />
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot"
            style={{ animationDelay: '0.2s' }}
          />
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot"
            style={{ animationDelay: '0.4s' }}
          />
        </div>
        <span className="sr-only">Agent is typing...</span>
      </div>
    </div>
  );
}
