'use client';

import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

const ToastProvider = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      // className="toast-container"
      // toastClassName="toast"
    />
  );
};

export default ToastProvider;