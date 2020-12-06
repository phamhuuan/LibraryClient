import React, {ElementRef, forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {CustomModalHandleType, NetworkErrorModalType} from '../../@types/common/CustomModal';
import CustomModal from './CustomModal';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

const NetworkErrorModal = forwardRef<CustomModalHandleType, NetworkErrorModalType>((props, ref) => {
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const modalRef = useRef<ModalHandleType>(null);
	const openModal = useCallback(() => {
		modalRef.current?.openModal();
	}, []);

	const closeModal = useCallback(() => {
		modalRef.current?.closeModal();
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			openModal,
			closeModal,
		}),
		[closeModal, openModal]
	);
	return (
		<CustomModal ref={modalRef} open={false}>
			<div>
				<InputLabel style={{textAlign: 'center', fontSize: 40, fontWeight: 'bold', color: 'red'}}>Network error</InputLabel>
				<InputLabel style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'black'}}>
					Please check network connection!
				</InputLabel>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<Button 
						variant="contained" 
						color="primary" 
						onClick={closeModal} 
						style={{width: 100}}>
						OK
					</Button>
				</div>
			</div>
		</CustomModal>
	)
});

export default NetworkErrorModal;