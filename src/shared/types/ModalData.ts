type ModalData = {
    title?                  : string,
    message                 : string,
    positiveButton?         : string,
    positiveButtonAction?   : () => void,
    negativeButton?         : string,
    negativeButtonAction?   : () => void,
    closeButtonAction?      : () => void,
};

export default ModalData;