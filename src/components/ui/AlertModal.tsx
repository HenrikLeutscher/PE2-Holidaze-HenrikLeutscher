import { Button } from "./Button";
import { CircleAlert } from "lucide-react";
import { AlertModalProps } from "../../types/AlertModalProps";

export function AlertModal({ message, onConfirm, onCancel }: AlertModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <CircleAlert className="mx-auto text-red-600 w-10 h-10" />
        <h3 className="text-header3 mb-4 text-center">{message}</h3>
        <div className="flex items-center justify-between">
          <Button
            text="Confirm"
            onClick={onConfirm}
            className="btn-primary w-2/5"
          />
          <Button
            text="Cancel"
            onClick={onCancel}
            className="btn-error hover:bg-red-700 w-2/5 "
          />
        </div>
      </div>
    </div>
  );
}
