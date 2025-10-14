import React from 'react';

type NotificationType = 'success' | 'error';

interface NotificationToastProps {
  notification: {
    type: NotificationType;
    message: string;
  };
  onClose: () => void;
}

const ICONS: Record<NotificationType, React.ReactNode> = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const BG_COLORS: Record<NotificationType, string> = {
  success: 'bg-secondary',
  error: 'bg-red-500',
};

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const { type, message } = notification;

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center w-full max-w-xs p-4 text-text-primary ${BG_COLORS[type]} rounded-lg shadow-lg animate-fade-in-up`}
      role="alert"
      style={{ animationDuration: '0.5s' }}
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-black/20">
        {ICONS[type]}
      </div>
      <div className="ml-3 text-sm font-medium text-white">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white/20 text-white rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-white/30 inline-flex h-8 w-8"
        aria-label="Close"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.607a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default NotificationToast;
