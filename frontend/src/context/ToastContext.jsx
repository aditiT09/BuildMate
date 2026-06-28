import { useState, useCallback } from "react";
import Toast from "../components/ui/Toast";
import { ToastContext } from "./ToastContextObject";

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, clearToast }}>
      {children}
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </ToastContext.Provider>
  );
}
