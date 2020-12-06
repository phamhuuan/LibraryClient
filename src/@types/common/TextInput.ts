import {TextFieldProps} from '@material-ui/core/TextField';

export interface TextInputStateType {
	value: string;
	error: boolean;
	helperText: string;
	type?: string;
	disable: boolean;
}

export interface TextInputSetStateType {
	value?: string;
	error?: boolean;
	helperText?: string;
	type?: string;
	disable?: boolean;
}

interface TextInputProps {
	value?: string;
	id?: string;
	error?: boolean;
	helperText?: string;
	label: string;
	type?: string;
}

export type TextInputPropsType = TextInputProps & TextFieldProps;

export interface TextInputHandleType {
	getTextInputState: () => TextInputStateType;
	setTextInputState: (newState: TextInputSetStateType) => void;
}

export const defaultTextInputState: TextInputStateType = {
	value: '',
	error: false,
	helperText: '',
	disable: false,
};