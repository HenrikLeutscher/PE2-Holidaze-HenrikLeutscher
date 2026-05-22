export type PopupMessageProps = {
  message: string;
  type?: "success" | "error";
  duration?: number; // Default is 2000ms if not defined
  onComplete?: () => void;
};
