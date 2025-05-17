'use client';

import { toast } from 'react-toastify';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const useToast = () => {
  const showToast = (
    message: string,
    type: ToastType = 'success',
    options = {}
  ) => {
    const toastOptions = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      ...options,
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast.warn(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  };

  return { showToast };
};

export default useToast;