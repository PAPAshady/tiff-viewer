import { useEffect } from "react";
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi";

export const Toast = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FiCheck className="h-5 w-5 text-green-500" />,
    error: <FiAlertCircle className="h-5 w-5 text-red-500" />,
  };

  const backgrounds = {
    success: "bg-green-50",
    error: "bg-red-50",
  };

  return (
    <div className="animate-fade-in fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-3 rounded-lg ${backgrounds[type]} p-4 shadow-lg`}
      >
        {icons[type]}
        <p className="text-sm text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 rounded-full p-1 hover:bg-gray-200"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
