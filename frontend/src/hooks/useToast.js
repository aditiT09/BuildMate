import { useContext, useMemo } from "react";
import { ToastContext } from "../context/ToastContextObject";

export function useToast() {
  const context = useContext(ToastContext);
  
  return useMemo(() => {
    if (!context) {
      // Return compatibility fallback wrapper with stable function references so that
      // test assertions on window.alert pass without triggering re-render dependency updates.
      return {
        toast: (msg) => {
          window.alert(msg);
        },
        clearToast: () => {},
      };
    }
    return {
      toast: context.showToast,
      clearToast: context.clearToast,
    };
  }, [context]);
}
