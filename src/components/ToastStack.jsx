const typeStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
};

const ToastStack = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-5 z-[100] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded shadow-lg px-4 py-3 text-sm flex items-start gap-3 ${typeStyles[toast.type] || typeStyles.info}`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/80 hover:text-white"
            aria-label="Cerrar notificacion"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastStack;
