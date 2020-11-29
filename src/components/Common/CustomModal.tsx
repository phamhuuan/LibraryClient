import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useState,
} from "react";
import Modal from "@material-ui/core/Modal";
import {CustomModalHandleType, CustomModalPropsType, CustomModalStateType} from "../../@types/common/CustomModal";
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			position: 'absolute',
			width: 400,
			backgroundColor: theme.palette.background.paper,
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
			borderRadius: 20,
		},
	}),
);

const CustomModal = forwardRef<CustomModalHandleType, CustomModalPropsType>((props, ref) => {
	const classes = useStyles();
	const [state, setState] = useState<CustomModalStateType>({
		isOpen: props.open || false,
	});

	const openModal = useCallback(() => {
		setState({...state, isOpen: true});
	}, [state]);

	const closeModal = useCallback(() => {
		setState({...state, isOpen: false});
	}, [state]);

	useImperativeHandle(
		ref,
		() => ({
			openModal,
			closeModal,
		}),
		[closeModal, openModal]
	);
	return (
		<Modal
			open={state.isOpen}
			onClose={closeModal}
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description"
			>
			<div style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} className={props.className !== undefined ? props.className : classes.paper}>
				{props.children}
			</div>
		</Modal>
	);
});

export default CustomModal;
