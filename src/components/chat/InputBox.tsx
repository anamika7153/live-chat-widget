import { useState, useRef, KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';

interface InputBoxProps {
  onSend: (message: string) => void;
  isDisabled: boolean;
  placeholder?: string;
}

export default function InputBox({ onSend, isDisabled, placeholder }: InputBoxProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed && !isDisabled) {
      onSend(trimmed);
      setValue('');
      textareaRef.current?.focus();
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 border-t border-gray-200 bg-white">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? 'Type a message...'}
        disabled={isDisabled}
        rows={1}
        className={cn(
          'flex-1 px-4 py-3',
          'border border-gray-300 rounded-2xl',
          'resize-none max-h-32',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          'text-sm'
        )}
        aria-label="Message input"
      />
      <button
        onClick={handleSend}
        disabled={isDisabled || !value.trim()}
        className={cn(
          'p-3',
          'bg-blue-500 text-white',
          'rounded-full',
          'hover:bg-blue-600',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:bg-gray-300 disabled:cursor-not-allowed',
          'transition-colors duration-200'
        )}
        aria-label="Send message"
      >
        {isDisabled ? (
          <svg
            className="w-5 h-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
