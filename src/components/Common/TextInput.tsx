import React, {
	ChangeEvent,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import TextField from "@material-ui/core/TextField";
import {
	TextInputHandleType,
	TextInputPropsType,
	TextInputSetStateType,
	TextInputStateType
} from '../../@types/common/TextInput'
import '../../styles/css/index.css';

const TextInput = forwardRef<TextInputHandleType, TextInputPropsType>((props, ref) => {
	const [state, setState] = useState<TextInputStateType>({
		value: props.value || '',
		type: props.type || undefined,
		error: props.error || false,
		helperText: props.helperText || '',
		disable: props.disabled || false,
	});
	const [animationClassName, setAnimationClassName] = useState<string>('');
	
	const getTextInputState = useCallback((): TextInputStateType => {
		return state;
	}, [state]);

	const setTextInputState = useCallback((newState: TextInputSetStateType): void => {
		setState({...state, ...newState});
	}, [state]);

	useImperativeHandle(
		ref,
		() => ({
			getTextInputState,
			setTextInputState,
		}),
		[getTextInputState, setTextInputState]
	);

	useEffect(() => {
		if (state.error) {
			setAnimationClassName('shake-animation');
		} else {
			setAnimationClassName('');
		}
	}, [state.error]);

	const setTextValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setState({...state, value: event.target.value, error: false, helperText: ''});
	};
	return (
		<div className={animationClassName}>
			<TextField
				style={props.style || undefined}
				disabled={state.disable}
				error={state.error}
				type={state.type}
				value={state.value}
				helperText={state.helperText}
				variant={props.variant || undefined}
				onChange={setTextValue}
				{...props}
			/>
		</div>
	);
});

export default TextInput;
