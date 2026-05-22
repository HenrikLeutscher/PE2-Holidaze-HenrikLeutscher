import { PopupMessageProps } from "../../types/PopupMessage";
import { useEffect, useState } from "react";

export function PopupMessage({
  message,
  type = "success",
  duration = 2000,
  onComplete,
}: PopupMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!visible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-primary";

  return (
    <div
      className={`absolute top-25 right-4 ${bgColor} text-white px-6 py-4 rounded shadow-lg text-bodytext`}
    >
      {message}
    </div>
  );
}
