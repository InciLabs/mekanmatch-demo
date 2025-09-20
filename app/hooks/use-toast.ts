import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  onClose?: () => void;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

const DEFAULT_DURATION = 3000; // 3 seconds

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback((message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
    setToast({
      isVisible: true,
      message,
      type,
    });

    const duration = options.duration || DEFAULT_DURATION;
    
    setTimeout(() => {
      hideToast();
      options.onClose?.();
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};

export default useToast;
