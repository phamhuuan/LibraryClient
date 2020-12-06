import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useState,
} from "react";
import Checkbox from "@material-ui/core/Checkbox";
import {
	CustomCheckboxHandleType,
	CustomCheckboxPropsType,
	CustomCheckboxStateType
} from '../../@types/common/CustomCheckbox'

const CustomCheckbox = forwardRef<CustomCheckboxHandleType, CustomCheckboxPropsType>((props, ref) => {
	const [state, setState] = useState<CustomCheckboxStateType>({
		checked: props.checked,
	});
	const toggleCheckbox = (): void => {
		setState({...state, checked: !state.checked});
	}
	const getCheckboxValue = useCallback((): boolean => {
		return state.checked;
	}, [state.checked]);
	useImperativeHandle(
		ref,
		() => ({
			getCheckboxValue,
		}),
		[getCheckboxValue]
	);
	return (
		<Checkbox
			checked={state.checked}
			color={props.color}
			onChange={toggleCheckbox}
		/>
	);
});

export default CustomCheckbox;
