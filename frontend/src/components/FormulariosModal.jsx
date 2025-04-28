import { forwardRef, useImperativeHandle, useRef } from "react";

const FormulariosModal = forwardRef(({ fecharModal, children }, ref) => {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    },
    close: () => {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    },
  }));

  return (
    <dialog ref={dialogRef} className="w-full max-w-4xl m-auto p-4 bg-white rounded-lg shadow-lg">
      {children}
    </dialog>
  );
});

FormulariosModal.displayName = 'FormulariosModal';
export default FormulariosModal;
