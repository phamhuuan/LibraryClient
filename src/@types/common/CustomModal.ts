import {ModalProps} from '@material-ui/core/Modal';
import {ReactNode} from 'react';
export interface CustomModalStateType {
	isOpen: boolean;
}

interface CustomModalProps {
	children: ReactNode,
}

export type CustomModalPropsType = CustomModalProps & ModalProps;

export interface CustomModalHandleType {
	openModal: () => void;
	closeModal: () => void;
}