import {ModalProps} from '@material-ui/core/Modal';
export interface CustomModalStateType {
	isOpen: boolean;
}

interface CustomModalProps {
}

export type CustomModalPropsType = CustomModalProps & ModalProps;

export interface NetworkErrorModalType {
}

export interface CustomModalHandleType {
	openModal: () => void;
	closeModal: () => void;
}