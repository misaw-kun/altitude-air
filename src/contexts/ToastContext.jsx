import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

function ToastProvider({ children }) {
  // array of notifications
  const [toasts, setToasts] = useState([]);

  const toast = (message, type) => {
    const newToast = {
      id: Date.now(),
      message,
      type,
    };

    setToasts([newToast]);

    // removing the toast after a short duration
    setTimeout(() => {
      setToasts([])
    }, 3000);
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded ${
              toast.type === "error"
                ? "bg-red-500 text-white"
                : toast.type === "info"
                ? "bg-indigo-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// making a custom hook of the toast
function useToast() {
  return useContext(ToastContext);
}

export { ToastProvider, useToast };
