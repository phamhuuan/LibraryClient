import {TextFieldProps} from '@material-ui/core/TextField';

export interface TextInputStateType {
	value: string;
	error: boolean;
	helperText: string;
	label: string;
	type?: string;
	disable: boolean;
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
	setTextInputState: (newState: TextInputStateType) => void;
}

export const defaultTextInputState: TextInputStateType = {
	value: '',
	error: false,
	helperText: '',
	label: '',
	disable: false,
};