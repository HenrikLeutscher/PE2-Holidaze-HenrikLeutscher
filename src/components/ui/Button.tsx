import React from "react";

interface ButtonProps {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  error?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  loading = false,
  error = false,
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${!loading && !error ? "btn-primary" : ""}
            ${loading ? "btn-loading" : ""}
            ${error ? "btn-error" : ""}
            ${className}`}
    >
      {loading && "Loading..."}
      {error && "Error"}
      {!loading && !error && (children || text)}
    </button>
  );
};
