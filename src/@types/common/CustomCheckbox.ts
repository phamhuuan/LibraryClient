import {CheckboxProps} from '@material-ui/core/Checkbox';
export interface CustomCheckboxStateType {
	checked: boolean;
}

interface CustomCheckboxProps {
	checked: boolean;
}

export type CustomCheckboxPropsType = CustomCheckboxProps & CheckboxProps;

export interface CustomCheckboxHandleType {
	getCheckboxValue: () => boolean;
}