const Modal = ({ open, onClose, children, contentClassName = '', showClose = true }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`relative max-h-[90vh] overflow-y-auto ${contentClassName}`}>
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-gray-800"
            aria-label="Cerrar modal"
          >
            X
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
